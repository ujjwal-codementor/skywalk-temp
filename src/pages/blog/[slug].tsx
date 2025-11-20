import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Layout from '@/components/layout/Layout'

interface BlogPost {
  title: string
  description: string
  slug: string
  file: string
}

export default function BlogPostPage() {
  const router = useRouter()
  const { slug } = router.query
  const [blog, setBlog] = useState<BlogPost | null>(null)
  const [content, setContent] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return

    // Fetch blogs.json to find the matching blog
    fetch('/blogs.json')
      .then((res) => res.json())
      .then((blogs: BlogPost[]) => {
        const foundBlog = blogs.find((b) => b.slug === slug)
        if (!foundBlog) {
          setError('Blog post not found')
          setLoading(false)
          return
        }
        setBlog(foundBlog)

        // Fetch the markdown content
        return fetch(foundBlog.file)
      })
      .then((res) => {
        if (!res) return
        if (!res.ok) {
          throw new Error('Failed to load blog content')
        }
        return res.text()
      })
      .then((text) => {
        if (text) {
          setContent(text)
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error('Error loading blog:', err)
        setError('Failed to load blog post')
        setLoading(false)
      })
  }, [slug])

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">Loading blog post...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (error || !blog) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Blog Post Not Found</h1>
            <p className="text-gray-600 mb-8">{error || 'The blog post you are looking for does not exist.'}</p>
            <Link href="/blogs" className="btn-primary">
              Back to Blogs
            </Link>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout
      title={`${blog.title} - Furnish Care`}
      description={blog.description}
    >
      <Head>
        <meta property="og:title" content={`${blog.title} - Furnish Care`} />
        <meta property="og:description" content={blog.description} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="article:author" content="Furnish Care" />
      </Head>

      {/* Background Animation Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <motion.div
          className="absolute top-20 right-20 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-10"
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-96 h-96 bg-secondary-200 rounded-full mix-blend-multiply filter blur-xl opacity-10"
          animate={{
            x: [0, 80, 0],
            y: [0, -60, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />
      </div>

      {/* Blog Post Content */}
      <article className="py-12 md:py-20 relative">
        <div className="container-width section-padding">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Link
              href="/blogs"
              className="inline-flex items-center text-primary-600 hover:text-primary-700 transition-colors"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Blogs
            </Link>
          </motion.div>

          {/* Markdown Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-code:text-primary-600 prose-code:bg-primary-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-blockquote:border-l-primary-600 prose-blockquote:text-gray-600 prose-ul:text-gray-700 prose-ol:text-gray-700 prose-li:text-gray-700"
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content}
            </ReactMarkdown>
          </motion.div>

          {/* Back to Blogs Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 pt-8 border-t border-gray-200"
          >
            <Link
              href="/blogs"
              className="btn-primary inline-flex items-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              View All Blogs
            </Link>
          </motion.div>
        </div>
      </article>
    </Layout>
  )
}

