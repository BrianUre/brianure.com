import { defineConfig, defineField, defineType } from "sanity";
import { structureTool } from "sanity/structure";

const servicesPageSchema = defineType({
  name: "servicesPage",
  title: "Services Page",
  type: "document",
  preview: {
    prepare: () => ({ title: "Services Page" }),
  },
  fields: [
    defineField({
      name: "weeklySection",
      title: "Ongoing Support Section",
      type: "object",
      fields: [
        defineField({ name: "caption", title: "Caption", type: "string" }),
        defineField({ name: "title", title: "Title", type: "string" }),
        defineField({ name: "description", title: "Description", type: "text" }),
      ],
    }),
    defineField({
      name: "milestoneSection",
      title: "Project Planning Section",
      type: "object",
      fields: [
        defineField({ name: "caption", title: "Caption", type: "string" }),
        defineField({ name: "title", title: "Title", type: "string" }),
        defineField({ name: "description", title: "Description", type: "text" }),
        defineField({
          name: "item",
          title: "Application Development Plan Card",
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "description", title: "Description", type: "text" }),
          ],
        }),
      ],
    }),
  ],
});

export default defineConfig({
  basePath: "/studio",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Services Page")
              .id("servicesPage")
              .child(
                S.documentTypeList("servicesPage")
                  .title("Services Page")
              ),
          ]),
    }),
  ],
  schema: {
    types: [servicesPageSchema],
  },
});
