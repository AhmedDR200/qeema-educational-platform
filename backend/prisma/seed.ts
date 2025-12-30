/**
 * Prisma Seed Script
 * Creates initial admin user and school profile
 * Run with: npx prisma db seed
 */

import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Seed Admin User
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@school.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!';

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        role: Role.ADMIN,
      },
    });
    
    console.log(`✅ Admin user created: ${adminEmail}`);
  } else {
    console.log(`ℹ️  Admin user already exists: ${adminEmail}`);
  }

  // Seed School Profile (singleton)
  const existingSchool = await prisma.school.findFirst();

  if (!existingSchool) {
    await prisma.school.create({
      data: {
        name: 'Qeema Academy',
        phoneNumber: '+20 123 456 7890',
        logoUrl: 'https://placehold.co/200x200/2563eb/white?text=QA',
      },
    });
    
    console.log('✅ School profile created');
  } else {
    console.log('ℹ️  School profile already exists');
  }

  // Seed Sample Lessons
  const lessonsCount = await prisma.lesson.count();

  if (lessonsCount === 0) {
    const sampleLessons = [
      {
        title: 'Introduction to Mathematics',
        description: 'Learn the fundamentals of mathematics including algebra, geometry, and basic calculus. This comprehensive course covers essential mathematical concepts that form the foundation for advanced studies.',
        imageUrl: 'https://placehold.co/400x300/3b82f6/white?text=Mathematics',
        rating: 4.5,
      },
      {
        title: 'English Literature Basics',
        description: 'Explore classic and contemporary literature, develop critical reading skills, and enhance your writing abilities. This course introduces you to various literary genres and analysis techniques.',
        imageUrl: 'https://placehold.co/400x300/8b5cf6/white?text=Literature',
        rating: 4.2,
      },
      {
        title: 'Physics Fundamentals',
        description: 'Understand the laws of physics that govern our universe. From mechanics to thermodynamics, this course provides a solid foundation in physical sciences.',
        imageUrl: 'https://placehold.co/400x300/06b6d4/white?text=Physics',
        rating: 4.7,
      },
      {
        title: 'Chemistry Essentials',
        description: 'Dive into the world of atoms, molecules, and chemical reactions. Learn about periodic table, bonding, and chemical equations in this engaging course.',
        imageUrl: 'https://placehold.co/400x300/10b981/white?text=Chemistry',
        rating: 4.3,
      },
      {
        title: 'World History Overview',
        description: 'Journey through time and explore major historical events, civilizations, and their impact on modern society. From ancient empires to contemporary history.',
        imageUrl: 'https://placehold.co/400x300/f59e0b/white?text=History',
        rating: 4.6,
      },
      {
        title: 'Biology and Life Sciences',
        description: 'Discover the wonders of life from cellular level to ecosystems. This course covers genetics, evolution, anatomy, and environmental biology.',
        imageUrl: 'https://placehold.co/400x300/22c55e/white?text=Biology',
        rating: 4.4,
      },
      {
        title: 'Computer Science Basics',
        description: 'Introduction to programming concepts, algorithms, and computational thinking. Learn the basics of coding and software development.',
        imageUrl: 'https://placehold.co/400x300/6366f1/white?text=CS',
        rating: 4.8,
      },
      {
        title: 'Art and Design Principles',
        description: 'Explore visual arts, design theory, and creative expression. Learn about color theory, composition, and various artistic techniques.',
        imageUrl: 'https://placehold.co/400x300/ec4899/white?text=Art',
        rating: 4.1,
      },
    ];

    await prisma.lesson.createMany({
      data: sampleLessons,
    });

    console.log(`✅ Created ${sampleLessons.length} sample lessons`);
  } else {
    console.log(`ℹ️  Lessons already exist (${lessonsCount} found)`);
  }

  console.log('🎉 Database seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

