import { predicate } from '@prismicio/client';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { getPrismicClient } from '../../services/prismic';
import styles from './styles.module.scss';

type Post = {
  slug: string;
  title: string;
  excerpt: string;
  updated_at: string;
};

interface PostsProps {
  posts: Post[];
}

export default function Posts({ posts }: PostsProps) {

  return (
    <>
      <Head>
        <title>Posts | Ignews</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map(post => (
            <Link key={post.slug} href={`/posts/${post.slug}`}>
              <a >
                <time>{post.updated_at}</time>
                <strong>{post.title}</strong>
                <p>{post.excerpt}</p>
              </a>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const response = await prismic.query([
    predicate.at('document.type', 'hero')
  ], {
    fetch: ['hero.title', 'hero.content'],
    pageSize: 100
  });

  const posts = response.results.map(post => {
    const excerpt = post.data.content.find(content => content.type === 'paragraph');

    return {
      slug: post.uid,
      title: post.data.title,
      excerpt: excerpt ? excerpt.text : '',
      updated_at: new Date(post.last_publication_date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    };
  });

  return {
    props: { posts }
  };
};