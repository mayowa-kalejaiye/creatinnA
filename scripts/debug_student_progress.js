require('dotenv').config();
const { getEnrollmentsForUser, getLessonsForCourseWithProgress } = require('../lib/db-adapter');

(async () => {
  const userId = '9a491fb0-5421-459d-b3bb-3956f8290bfe'; // example student
  console.log('enrollments for', userId);
  const enrolls = await getEnrollmentsForUser(userId);
  console.log(JSON.stringify(enrolls, null, 2));
  for (const en of enrolls) {
    console.log('lessons for course', en.courseId);
    const lessons = await getLessonsForCourseWithProgress(userId, en.courseId);
    console.log(JSON.stringify(lessons, null, 2));
  }
})();
