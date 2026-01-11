import { auth } from "@/lib/auth";
import { sqlite } from "@/lib/prisma";
import CoursesClient from "./CoursesClient";

export default async function CoursesPage() {
  // Load published courses
  const courses = sqlite
    .prepare(`SELECT * FROM "Course" WHERE isPublished = 1 ORDER BY createdAt DESC`)
    .all();

  return (
    <div>
      <CoursesClient courses={courses} />
    </div>
  );
}
