// import type { NextPage } from "next"
// import { useState } from "react"
// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { usePostApi } from "@/lib/apiCallerClient"

// import Header from "@/components/layout/Header"
// import Footer from "@/components/layout/Footer"
// import { useRouter } from "next/router"
// const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL as string;


// const UserFormPage: NextPage = () => {
//   const [formData, setFormData] = useState({
//     fullName: "",
//     email: "",
//     phoneNumber: "",
//     address: "",
//     acceptTerms: false,
//   })

//   const postApi = usePostApi();
//   const router  = useRouter();

//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }))
//   }

//   const handleCheckboxChange = (checked: boolean) => {
//     setFormData((prev) => ({
//       ...prev,
//       acceptTerms: checked,
//     }))
//   }

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!formData.acceptTerms) {
//       alert("Please accept the terms and conditions to continue.")
//       return
//     }
//     try{
//       const res = postApi(`${BACKEND_URL}/api/user/setDetails`, {
//         fullName: formData.fullName,
//         email: formData.email,
//         Phone: formData.phoneNumber,
//         address: formData.address
//       })
//     }
//     //toast success
//     // router.push()
//     catch{
//       // toast error
//       router.push("/");
//     }
//   }

//   return (
//     <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
//       <Header />

//       {/* Main Content */}
//       <main className="flex-grow p-4">
//         <div className="max-w-2xl mx-auto pt-8">
//           {/* Header Section */}
          // <div className="text-center mb-8">
          //   <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary-800 rounded-full mb-4">
          //     <svg
          //       className="w-8 h-8 text-primary-foreground"
          //       fill="none"
          //       stroke="currentColor"
          //       viewBox="0 0 24 24"
          //     >
          //       <path
          //         strokeLinecap="round"
          //         strokeLinejoin="round"
          //         strokeWidth={2}
          //         d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
          //       />
          //     </svg>
          //   </div>
          //   <h1 className="text-3xl font-bold text-foreground mb-2">
          //     Premium Furniture Care
          //   </h1>
          //   <p className="text-muted-foreground text-lg">
          //     Join our exclusive restoration subscription service
          //   </p>
          // </div>

//           {/* Card with Form */}
//           <Card className="shadow-xl border-0 bg-card/80 backdrop-blur-sm">
//             <CardHeader className="bg-gradient-to-r bg-primary-900 from-primary to-primary/90 text-primary-foreground rounded-t-lg">
//               <CardTitle className="text-2xl font-bold flex items-center gap-3">
//                 <svg
//                   className="w-6 h-6"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
//                   />
//                 </svg>
//                 Get Started Today
//               </CardTitle>
//               <p className="text-primary-foreground/90 mt-2">
//                 Tell us about yourself and your furniture care needs
//               </p>
//             </CardHeader>
//             <CardContent className="p-8 space-y-6">
//               <form onSubmit={handleSubmit} className="space-y-6">
//                 {/* Full Name + Email */}
//                 <div className="grid md:grid-cols-2 gap-6">
//                   <div className="space-y-2">
//                     <Label
//                       htmlFor="fullName"
//                       className="text-foreground font-semibold flex items-center gap-2"
//                     >
//                       Full Name *
//                     </Label>
//                     <Input
//                       id="fullName"
//                       name="fullName"
//                       type="text"
//                       required
//                       value={formData.fullName}
//                       onChange={handleInputChange}
//                       placeholder="Enter your full name"
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label
//                       htmlFor="email"
//                       className="text-foreground font-semibold flex items-center gap-2"
//                     >
//                       Email Address *
//                     </Label>
//                     <Input
//                       id="email"
//                       name="email"
//                       type="email"
//                       required
//                       value={formData.email}
//                       onChange={handleInputChange}
//                       placeholder="Enter your email address"
//                     />
//                   </div>
//                 </div>

//                 {/* Phone Number */}
//                 <div className="space-y-2">
//                   <Label htmlFor="phoneNumber" className="text-foreground font-semibold">
//                     Phone Number *
//                   </Label>
//                   <Input
//                     id="phoneNumber"
//                     name="phoneNumber"
//                     type="tel"
//                     required
//                     value={formData.phoneNumber}
//                     onChange={handleInputChange}
//                     placeholder="Enter your phone number"
//                   />
//                 </div>

//                 {/* Address */}
//                 <div className="space-y-2">
//                   <Label htmlFor="address" className="text-foreground font-semibold">
//                     Service Address *
//                   </Label>
//                   <Textarea
//                     id="address"
//                     name="address"
//                     required
//                     value={formData.address}
//                     onChange={handleInputChange}
//                     placeholder="Enter your complete address"
//                   />
//                 </div>

//                 {/* Checkbox */}
//                 <div className="bg-muted/50 p-6 rounded-lg border border-border">
//                   <div className="flex items-start space-x-4">
//                     <Checkbox
//                       id="acceptTerms"
//                       checked={formData.acceptTerms}
//                       onCheckedChange={handleCheckboxChange}
//                     />
//                     <div className="flex-1">
//                       <Label
//                         htmlFor="acceptTerms"
//                         className="text-foreground cursor-pointer leading-relaxed"
//                       >
//                         I agree to the{" "}
//                         <Link
//                           href="/user/t&c"
//                           className="text-primary hover:text-primary/80 underline font-semibold transition-colors"
//                         >
//                           Terms and Conditions
//                         </Link>{" "}
//                         *
//                       </Label>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Submit */}
//                 <Button
//                   type="submit"
//                   className="w-full bg-primary-900 hover:bg-primary/90 text-primary-foreground font-bold py-4 h-14 text-lg transition-all duration-200"
//                   disabled={!formData.acceptTerms}
//                 >
//                   Start My Premium Service
//                 </Button>
//               </form>
//             </CardContent>
//           </Card>
//         </div>
//       </main>

//       <Footer />
//     </div>
//   )
// }

// export default UserFormPage


import type { NextPage } from "next"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { usePostApi } from "@/lib/apiCallerClient"
import { useRouter } from "next/router"

import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL as string;

// --- Validation Helpers ---
const sanitizeInput = (value: string) => {
  return value.replace(/<[^>]*>?/gm, ""); // remove tags, but keep spaces
};

const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone: string) => {
  const phoneRegex = /^(\+1)?\s?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/; // US numbers
  return phoneRegex.test(phone);
};

const UserFormPage: NextPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    address: "",
    acceptTerms: false,
  });

  const [loading, setLoading] = useState(false);
  const postApi = usePostApi();
  const router = useRouter();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: sanitizeInput(value),
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      acceptTerms: checked,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // --- Validations ---
    if (!formData.acceptTerms) {
      alert("Please accept the terms and conditions to continue.");
      return;
    }
    if (!validateEmail(formData.email)) {
      alert("Please enter a valid email address.");
      return;
    }
    if (!validatePhone(formData.phoneNumber)) {
      alert("Please enter a valid US phone number (e.g. 123-456-7890).");
      return;
    }

    try {
      setLoading(true);
      await postApi(`${BACKEND_URL}/api/user/setDetails`, {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phoneNumber,
        address: formData.address,
      });

      // success -> redirect
      router.push("/user/progress");
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("Something went wrong. Please try again.");
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <Header />

      <main className="flex-grow p-4">

        <div className="max-w-2xl mx-auto pt-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary-800 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-primary-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Premium Furniture Care
            </h1>
            <p className="text-muted-foreground text-lg">
              Join our exclusive restoration subscription service
            </p>
          </div>
          {/* Card with Form */}
          <Card className="shadow-xl border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r bg-primary-900 from-primary to-primary/90 text-primary-foreground rounded-t-lg">
              <CardTitle className="text-2xl font-bold flex items-center gap-3">
                Get Started Today
              </CardTitle>
              <p className="text-primary-foreground/90 mt-2">
                Tell us about yourself and your furniture care needs
              </p>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name + Email */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number *</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    required
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="e.g. 123-456-7890"
                  />
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <Label htmlFor="address">Service Address *</Label>
                  <Textarea
                    id="address"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter your complete address"
                  />
                </div>

                {/* Checkbox */}
                <div className="bg-muted/50 p-6 rounded-lg border border-border">
                  <div className="flex items-start space-x-4">
                    <Checkbox
                      id="acceptTerms"
                      checked={formData.acceptTerms}
                      onCheckedChange={handleCheckboxChange}
                    />
                    <div className="flex-1">
                      <Label htmlFor="acceptTerms" className="cursor-pointer leading-relaxed">
                        I agree to the{" "}
                        <Link
                          href="/user/t&c"
                          className="text-primary hover:text-primary/80 underline font-semibold transition-colors"
                        >
                          Terms and Conditions
                        </Link>{" "}
                        *
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Submit with Loader */}
                <Button
                  type="submit"
                  className="w-full bg-primary-900 hover:bg-primary/90 text-primary-foreground font-bold py-4 h-14 text-lg transition-all duration-200 flex items-center justify-center"
                  disabled={!formData.acceptTerms || loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        ></path>
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    "Start My Premium Service"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default UserFormPage

