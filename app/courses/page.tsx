import { auth } from "@/lib/auth";
import { getPublishedCoursesWithCounts } from "@/lib/db-adapter";
import Header from '@/components/Header';
import CoursesClient from "./CoursesClient";

export default async function CoursesPage() {
  // Load published courses (adapter returns counts and normalized fields)
  const courses = await getPublishedCoursesWithCounts();
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
  // `courses` already includes _count when returned from adapter; ensure it's an array
  const courseList = Array.isArray(courses) ? courses : [];

  return (
    <div className="min-h-screen">
      <Header />
      <div>
        <CoursesClient courses={courseList} userEnrollments={[]} isLoggedIn={false} />
      </div>
    </div>
  );
}
