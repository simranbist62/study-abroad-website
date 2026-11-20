//data types for db.json
export type Destination = {
  id: string;
  name: string;
  tagline: string;
  tuition: string;
  image: string;
  desc: string;
  intakes: string[];
  popularCourses: string[];
};

export type Service = {
  id: number;
  title: string;
  icon: string;
  desc: string;
};

export type Testimonial = {
  id: number;
  name: string;
  destination: string;
  course: string;
  quote: string;
};

export type Faq = {
  id: number;
  q: string;
  a: string;
};

export type Blog = {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  date: Date;
  body: string;
  image: string;
};

export type Enquiry = {
  id: number | string;
  name: string;
  email: string;
  phone: string;
  country: string;
  message: string;
  status: string;
  note: string;
  date: string;
};
