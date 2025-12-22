import 'dotenv/config';
import { AppDataSource } from '../config/database';
import { Event } from '../entities/Event';

const eventTypes = ['page_view', 'button_click', 'form_submit', 'download', 'signup'];
const pages = ['/home', '/products', '/about', '/contact', '/pricing', '/blog', '/features'];
const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge'];
const devices = ['Desktop', 'Mobile', 'Tablet'];
const countries = ['USA', 'UK', 'Canada', 'Germany', 'France', 'Australia'];

const getRandomItem = <T>(array: T[]): T => array[Math.floor(Math.random() * array.length)];

const generateRandomDate = (daysAgo: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(Math.floor(Math.random() * 24));
  date.setMinutes(Math.floor(Math.random() * 60));
  return date;
};

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log('Database connected');

    const eventRepository = AppDataSource.getRepository(Event);

    await eventRepository.clear();
    console.log('Cleared existing events');

    const events: Partial<Event>[] = [];
    const userIds = Array.from({ length: 500 }, (_, i) => `user_${i + 1}`);

    for (let i = 0; i < 5000; i++) {
      const daysAgo = Math.floor(Math.random() * 30);
      
      events.push({
        eventType: getRandomItem(eventTypes),
        userId: getRandomItem(userIds),
        sessionId: `session_${Math.floor(Math.random() * 1000)}`,
        page: getRandomItem(pages),
        browser: getRandomItem(browsers),
        device: getRandomItem(devices),
        country: getRandomItem(countries),
        timestamp: generateRandomDate(daysAgo),
        metadata: {
          referrer: Math.random() > 0.5 ? 'google' : 'direct',
          duration: Math.floor(Math.random() * 300),
        },
      });
    }

    await eventRepository.save(events);
    console.log(`Seeded ${events.length} events`);

    await AppDataSource.destroy();
    console.log('Seeding completed');
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();

