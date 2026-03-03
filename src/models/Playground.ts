import { HydratedDocument, Model, Schema, model, models } from "mongoose";

export type Diagram = Record<string, unknown>;

export interface PlaygroundVersion {
  title: string;
  description: string;
  diagram: Diagram;
  createdAt: Date;
}

export interface PlaygroundDocument {
  title: string;
  description: string;
  userId: string;
  isPublic: boolean;
  diagram: Diagram;
  versions: PlaygroundVersion[];
  createdAt: Date;
  updatedAt: Date;
}

const PlaygroundVersionSchema = new Schema<PlaygroundVersion>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    diagram: { type: Schema.Types.Mixed, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const PlaygroundSchema = new Schema<PlaygroundDocument>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    userId: { type: String, required: true },
    isPublic: { type: Boolean, default: false },
    diagram: {
      type: Schema.Types.Mixed,
      default: { nodes: [], edges: [] },
    },
    versions: {
      type: [PlaygroundVersionSchema],
      default: [],
    },
  },
  { timestamps: true },
);

export type PlaygroundHydratedDocument = HydratedDocument<PlaygroundDocument>;

const existingPlaygroundModel = models.Playground as Model<PlaygroundDocument> | undefined;

if (existingPlaygroundModel && !existingPlaygroundModel.schema.path("isPublic")) {
  existingPlaygroundModel.schema.add({
    isPublic: { type: Boolean, default: false },
  });
}

export const Playground = existingPlaygroundModel || model<PlaygroundDocument>("Playground", PlaygroundSchema);
