import { connectDB } from "@/lib/mongodb";
import { Diagram, Playground } from "@/models/Playground";
import GraphQLJSON from "graphql-type-json";
import { Types } from "mongoose";

type ResolverContext = {
  session?: {
    user?: {
      email?: string | null;
    };
  } | null;
};

type PlaygroundByIdArgs = {
  id: string;
};

type CreatePlaygroundArgs = {
  title: string;
  description: string;
};

type UpdatePlaygroundArgs = {
  id: string;
  title: string;
  description: string;
  diagram?: Diagram;
  createVersion?: boolean;
};

type TogglePublicArgs = {
  id: string;
  isPublic: boolean;
};
type DeletePlaygroundArgs = {
  id: string;
};

const cloneDiagram = (diagram: Diagram): Diagram => JSON.parse(JSON.stringify(diagram)) as Diagram;

const ensurePublicField = () => {
  if (!Playground.schema.path("isPublic")) {
    Playground.schema.add({
      isPublic: { type: Boolean, default: false },
    });
  }
};

const stripFunctions = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map((item) => stripFunctions(item));
  }

  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>)
      .filter(([, entryValue]) => typeof entryValue !== "function")
      .map(([key, entryValue]) => [key, stripFunctions(entryValue)]);

    return Object.fromEntries(entries);
  }

  return value;
};

const sanitizeDiagram = (diagram: Diagram): Diagram => {
  const stripped = stripFunctions(diagram) as Record<string, unknown>;

  const nodes = Array.isArray(stripped.nodes) ? stripped.nodes : [];
  const edges = Array.isArray(stripped.edges) ? stripped.edges : [];

  return {
    ...stripped,
    nodes,
    edges,
  };
};

export const resolvers = {
  JSON: GraphQLJSON,
  Playground: {
    id: (parent: { id?: string; _id?: { toString: () => string } | string }) => {
      if (typeof parent?.id === "string" && parent.id.length > 0) {
        return parent.id;
      }

      if (typeof parent?._id === "string") {
        return parent._id;
      }

      if (parent?._id && typeof parent._id.toString === "function") {
        return parent._id.toString();
      }

      return null;
    },
    isPublic: (parent: {
      isPublic?: boolean | null;
      _doc?: { isPublic?: boolean };
      get?: (path: string) => unknown;
    }) => {
      if (typeof parent?.isPublic === "boolean") {
        return parent.isPublic;
      }

      const fromGetter = parent?.get?.("isPublic");
      if (typeof fromGetter === "boolean") {
        return fromGetter;
      }

      if (typeof parent?._doc?.isPublic === "boolean") {
        return parent._doc.isPublic;
      }

      return false;
    },
  },
  Query: {
    playgrounds: async (_: unknown, __: unknown, context: ResolverContext) => {
      ensurePublicField();
      if (!context.session?.user?.email) {
        throw new Error("Not authenticated");
      }

      await connectDB();

      return Playground.find({
        userId: context.session.user.email,
      })
        .sort({ createdAt: -1 })
        .lean();
    },
    playground: async (_: unknown, args: PlaygroundByIdArgs, context: ResolverContext) => {
      ensurePublicField();
      if (!context.session?.user?.email) {
        throw new Error("Not authenticated");
      }

      await connectDB();

      return Playground.findOne({
        _id: args.id,
        userId: context.session.user.email,
      }).lean();
    },
    sharedPlayground: async (_: unknown, args: PlaygroundByIdArgs) => {
      ensurePublicField();
      await connectDB();

      const playground = await Playground.findById(args.id).lean();
      if (!playground) {
        throw new Error("Playground not found");
      }

      if (!playground.isPublic) {
        throw new Error("This playground is private");
      }

      return playground;
    },
  },

  Mutation: {
    createPlayground: async (_: unknown, args: CreatePlaygroundArgs, context: ResolverContext) => {
      ensurePublicField();
      if (!context.session?.user?.email) {
        throw new Error("Not authenticated");
      }

      await connectDB();

      const playground = await Playground.create({
        title: args.title,
        description: args.description,
        userId: context.session.user.email,
        isPublic: false,
      });

      return playground;
    },
    updatePlayground: async (_: unknown, args: UpdatePlaygroundArgs, context: ResolverContext) => {
      ensurePublicField();
      if (!context.session?.user?.email) {
        throw new Error("Not authenticated");
      }

      await connectDB();

      const existing = await Playground.findOne({
        _id: args.id,
        userId: context.session.user.email,
      });

      if (!existing) {
        throw new Error("Playground not found");
      }

      if (args.createVersion !== false) {
        // Snapshot current state first so each version remains immutable.
        existing.versions.push({
          title: existing.title,
          description: existing.description,
          diagram: sanitizeDiagram(cloneDiagram(existing.diagram ?? {})),
          createdAt: new Date(),
        });
      }

      existing.title = args.title;
      existing.description = args.description;
      existing.diagram = sanitizeDiagram(cloneDiagram(args.diagram ?? {}));

      await existing.save();

      return existing;
    },
    togglePublic: async (_: unknown, args: TogglePublicArgs, context: ResolverContext) => {
      ensurePublicField();
      if (!context.session?.user?.email) {
        throw new Error("Not authenticated");
      }

      await connectDB();

      const objectId = new Types.ObjectId(args.id);
      const result = await Playground.collection.findOneAndUpdate(
        {
          _id: objectId,
          userId: context.session.user.email,
        },
        {
          $set: { isPublic: args.isPublic },
        },
        {
          returnDocument: "after",
        },
      );

      if (!result) {
        throw new Error("Playground not found");
      }

      return {
        ...result,
        id: result._id.toString(),
        isPublic: Boolean(result.isPublic),
      };
    },
    deletePlayground: async (_: unknown, args: DeletePlaygroundArgs, context: ResolverContext) => {
      ensurePublicField();
      if (!context.session?.user?.email) {
        throw new Error("Not authenticated");
      }

      await connectDB();

      const result = await Playground.deleteOne({
        _id: args.id,
        userId: context.session.user.email,
      });

      if (result.deletedCount === 0) {
        throw new Error("Playground not found");
      }

      return true;
    },
  },
};
