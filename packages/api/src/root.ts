import { configRouter } from "./router/config";
import { foldersRouter } from "./router/folder";
import { imageRouter } from "./router/image";
import { libraryRouter } from "./router/library";
import { tagsRouter } from "./router/tags";
import { t } from "./trpc";

export { type LibraryAdd } from "./router/library";
export { type ExtEnum, type OrderByObject } from "./router/image/get";

export const appRouter = t.router({
  library: libraryRouter,
  image: imageRouter,
  config: configRouter,
  tags: tagsRouter,
  folders: foldersRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
