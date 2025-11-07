import db from './connection';
import { CreatePageRequest } from '../types/page.types';

/**
 * Seed database with example data
 */
async function seed() {
  try {
    console.log('🌱 Starting database seed...');
    
    // Initialize database connection
    db.initialize();
    
    // Example page data
    const examplePage: CreatePageRequest = {
      slug: 'home',
      title: 'Bienvenido a DataHoy',
      metadata: {
        description: 'Página principal de DataHoy',
        keywords: ['noticias', 'datahoy'],
        ogImage: 'https://example.com/og-image.jpg',
      },
      components: [
        {
          type: 'Hero',
          id: 'hero-1',
          props: {
            title: 'Bienvenido a DataHoy',
            subtitle: 'Las últimas noticias al instante',
            ctaText: 'Ver Noticias',
            ctaLink: '/noticias',
          },
        },
        {
          type: 'ArticleList',
          id: 'article-list-1',
          props: {
            title: 'Últimas Noticias',
            columns: 3,
          },
          children: [
            {
              type: 'ArticleCard',
              id: 'article-1',
              props: {
                title: 'Ejemplo de Noticia',
                excerpt: 'Esta es una noticia de ejemplo que muestra cómo funciona el sistema.',
                image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c',
                author: 'Editor DataHoy',
                publishedAt: '2024-01-15T10:00:00Z',
                category: 'Tecnología',
                link: '/noticias/ejemplo',
              },
            },
            {
              type: 'ArticleCard',
              id: 'article-2',
              props: {
                title: 'Otra Noticia Importante',
                excerpt: 'Contenido de otra noticia importante para los lectores.',
                image: 'https://images.unsplash.com/photo-1495020689067-958852a7765e',
                author: 'Editor DataHoy',
                publishedAt: '2024-01-14T15:30:00Z',
                category: 'Política',
                link: '/noticias/otra-noticia',
              },
            },
            {
              type: 'ArticleCard',
              id: 'article-3',
              props: {
                title: 'Tercera Noticia',
                excerpt: 'Una tercera noticia para completar la lista de ejemplos.',
                image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643',
                author: 'Editor DataHoy',
                publishedAt: '2024-01-13T08:00:00Z',
                category: 'Deportes',
                link: '/noticias/tercera-noticia',
              },
            },
          ],
        },
      ],
    };

    // Check if page already exists
    const existingPage = await db.query(
      'SELECT id FROM pages WHERE slug = $1',
      [examplePage.slug]
    );

    if (existingPage.rows.length > 0) {
      console.log('⚠️  Page with slug "home" already exists, skipping seed');
      process.exit(0);
    }

    // Insert example page
    await db.query(
      `INSERT INTO pages (slug, title, metadata, components)
       VALUES ($1, $2, $3::jsonb, $4::jsonb)`,
      [
        examplePage.slug,
        examplePage.title,
        JSON.stringify(examplePage.metadata),
        JSON.stringify(examplePage.components),
      ]
    );

    console.log('✅ Seed completed successfully');
    console.log('📄 Created example page with slug: home');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seed();

