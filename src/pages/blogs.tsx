import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Layout from '@/components/layout/Layout'
import { Card, CardHeader, CardTitle, CardDescription, CardFooter, CardContent } from '@/components/ui/card'

interface BlogPost {
  title: string
  description: string
  slug: string
  file: string
}

export default function Blogs() {
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/blogs.json')
      .then((res) => res.json())
      .then((data) => {
        setBlogs(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Error loading blogs:', err)
        setLoading(false)
      })
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  }

  return (
    <Layout title="Blogs - Furnish Care" description="Explore our latest blog posts about Furniture wellness and how Furnishcare can help you protect your furniture.">
      <Head>
        <meta property="og:title" content="Blogs - Furnish Care" />
        <meta property="og:description" content="Explore our latest blog posts about Furniture wellness and how Furnishcare can help you protect your furniture." />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      {/* Background Animation Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute top-40 right-10 w-72 h-72 bg-secondary-200 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />
        <motion.div
          className="absolute -bottom-20 left-1/2 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{
            x: [0, 50, 0],
            y: [0, -80, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
        />
      </div>

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="container-width section-padding">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Our <span className="text-primary-600">Blogs</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
            Explore our latest blog posts about Furniture wellness and how Furnishcare can help you protect your furniture.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Blog Grid Section */}
      <section className="py-20 relative">
        <div className="container-width section-padding">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              <p className="mt-4 text-gray-600">Loading blogs...</p>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {blogs.map((blog, index) => (
                <motion.div
                  key={blog.slug}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                >
                  <Card className="h-full flex flex-col hover:shadow-xl transition-shadow duration-300 border-gray-200">
                    <CardHeader>
                      <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                        {blog.title}
                      </CardTitle>
                      <CardDescription className="text-gray-600 text-base">
                        {blog.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                      {/* Optional: Add a preview image or icon here */}
                    </CardContent>
                    <CardFooter>
                      <Link
                        href={`/blog/${blog.slug}`}
                        className="w-full"
                      >
                        <motion.button
                          className="w-full btn-primary"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Read More
                        </motion.button>
                      </Link>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}

          {!loading && blogs.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-600 text-lg">No blog posts available at the moment.</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  )
}

