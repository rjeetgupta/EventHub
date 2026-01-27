export interface Event {
    id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    department: "Computer Science" | "Electronics" | "Mechanical" | "Civil" | "Arts";
    image: string;
    category: "Workshop" | "Seminar" | "Competition" | "Cultural";
    isFeatured?: boolean;
  }
  
  export const events: Event[] = [
    {
      id: "1",
      title: "AI & Future of Robotics",
      description: "Join us for a deep dive into the latest trends in artificial intelligence and its application in modern robotics.",
      date: "2025-03-15T10:00:00",
      location: "Main Auditorium, Block A",
      department: "Computer Science",
      image: "images.unsplash.com",
      category: "Seminar"
    },
    {
      id: "2",
      title: "Hack-the-Chain 2025",
      description: "A 24-hour marathon to build decentralized solutions for real-world problems. Great prizes for winners!",
      date: "2025-04-05T09:00:00",
      location: "Innovation Lab, 3rd Floor",
      department: "Computer Science",
      image: "images.unsplash.com",
      category: "Competition"
    },
    {
      id: "3",
      title: "Eco-Structural Design Workshop",
      description: "Learning sustainable building practices and modern architectural software for civil engineers.",
      date: "2025-03-22T11:30:00",
      location: "Civil Design Studio",
      department: "Civil",
      image: "images.unsplash.com",
      category: "Workshop"
    },
    {
      id: "4",
      title: "Annual Tech Expo",
      description: "Showcasing the best student projects from all engineering departments. Networking with industry leaders.",
      date: "2025-05-10T10:00:00",
      location: "College Grounds",
      department: "Electronics",
      image: "images.unsplash.com",
      category: "Cultural"
    },
    {
      id: "5",
      title: "Fluid Dynamics Seminar",
      description: "Understanding complex fluid behaviors in aerospace engineering and automotive design.",
      date: "2025-03-28T14:00:00",
      location: "Mechanical Seminar Hall",
      department: "Mechanical",
      image: "images.unsplash.com",
      category: "Seminar"
    },
    {
      id: "6",
      title: "Digital Art Exhibition",
      description: "Exploring the intersection of traditional painting and modern digital brushes and VR modeling.",
      date: "2025-04-12T16:00:00",
      location: "Art Gallery, North Campus",
      department: "Arts",
      image: "images.unsplash.com",
      category: "Cultural"
    }
  ];
  