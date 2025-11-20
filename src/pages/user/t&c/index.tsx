import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { GetStaticProps } from "next";
import fs from "fs";
import path from "path";

interface TermsAndConditionsProps {
  markdownContent: string;
}

export default function TermsAndConditions({ markdownContent }: TermsAndConditionsProps) {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-xl border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground">
              <CardTitle className="text-2xl font-bold flex items-center gap-3">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Terms & Conditions – Furnish Care Subscription Service
              </CardTitle>
            </CardHeader>

            <CardContent className="p-8 bg-card">
              <div className="prose prose-lg max-w-none text-card-foreground prose-headings:text-card-foreground prose-h1:text-3xl prose-h1:font-bold prose-h1:mb-6 prose-h2:text-xl prose-h2:font-semibold prose-h2:mb-4 prose-h2:mt-8 prose-p:mb-4 prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-2 prose-li:text-card-foreground prose-strong:text-card-foreground prose-strong:font-semibold">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {markdownContent}
                </ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const filePath = path.join(process.cwd(), "public", "terms.md");
  const markdownContent = fs.readFileSync(filePath, "utf-8");

  return {
    props: {
      markdownContent,
    },
  };
};
