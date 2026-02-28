import { auth } from "@/lib/auth";
import { sqlite } from "@/lib/prisma";
import CoursesClient from "./CoursesClient";

export default async function CoursesPage() {
  // Load published courses
  const coursesRaw = sqlite
    .prepare(`SELECT id, title, slug, description, thumbnail, price, duration, level, category FROM "Course" WHERE isPublished = 1 ORDER BY createdAt DESC`)
    .all();
  type Course = {
    id: string;
    title: string;
    slug: string;
    description: string;
    thumbnail: string | null;
    price: number;
    duration: string;
    level: string;
    category: string;
    _count: { enrollments: number; modules: number };
  };
  // Add _count with default values for now
  const courses: Course[] = Array.isArray(coursesRaw)
    ? (coursesRaw as any[]).map((c) => ({
        ...c,
        description: c.description ?? '',
        thumbnail: c.thumbnail ?? null,
        price: c.price ?? 0,
        duration: c.duration ?? '',
        level: c.level ?? '',
        category: c.category ?? '',
        _count: { enrollments: 0, modules: 0 },
      }))
    : [];

  return (
    <div>
      <CoursesClient courses={courses} userEnrollments={[]} isLoggedIn={false} />
    </div>
  );
}
