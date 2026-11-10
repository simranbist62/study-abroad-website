//data types for db.json
export type Destination = {
  id: string;
  name: string;
  tagline: string;
  tuition: string;
  image: string;
  desc: string;
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
