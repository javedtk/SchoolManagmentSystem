import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-public-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  @Input() events: any[] = [];
  @Output() navigateTab = new EventEmitter<string>();

  departments = [
    { name: 'Science & Tech', icon: 'fas fa-laptop-code', itemCount: 18 },
    { name: 'Humanities', icon: 'fas fa-book-reader', itemCount: 12 },
    { name: 'Creative Arts', icon: 'fas fa-palette', itemCount: 8 },
    { name: 'Athletics', icon: 'fas fa-running', itemCount: 10 }
  ];

  whyChooseUs = [
    {
      icon: 'fas fa-chalkboard-teacher',
      title: 'Certified Mentors',
      description: 'Our team of world-class educators and subject experts brings decades of teaching experience to inspire academic excellence.'
    },
    {
      icon: 'fas fa-microscope',
      title: 'Advanced STEM Labs',
      description: 'State-of-the-art facilities equipped with modern research tools, coding suites, and interactive 3D learning resources.'
    },
    {
      icon: 'fas fa-brain',
      title: 'Holistic Development',
      description: 'A well-rounded curriculum designed to foster emotional intelligence, creative expression, leadership, and physical fitness.'
    },
    {
      icon: 'fas fa-user-graduate',
      title: 'Global College Pathways',
      description: 'Comprehensive college counseling that maps pathways and supports direct applications to elite international universities.'
    }
  ];

  featuredPrograms = [
    {
      name: 'AP Computer Science',
      description: 'A comprehensive study of Java, algorithms, data structures, and foundational object-oriented programming principles.',
      credits: '4 Credits',
      image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600',
      duration: '1 Year',
      level: 'Advanced'
    },
    {
      name: 'Biotechnology & Genetics',
      description: 'Hands-on laboratory training exploring DNA sequencing, CRISPR technologies, and modern molecular biology applications.',
      credits: '3 Credits',
      image: 'https://images.unsplash.com/photo-1532187643603-ba119ca4109e?w=600',
      duration: '1 Semester',
      level: 'Intermediate'
    },
    {
      name: 'Creative Writing & Journalism',
      description: 'A dynamic seminar focusing on investigative reporting, narrative composition, digital journalism, and creative essay writing.',
      credits: '3 Credits',
      image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600',
      duration: '1 Semester',
      level: 'Beginner'
    }
  ];

  studentPathway = [
    {
      icon: 'fas fa-file-signature',
      title: 'Apply',
      description: 'Submit an online enquiry and necessary documents through our portal.'
    },
    {
      icon: 'fas fa-search',
      title: 'Discover',
      description: 'Attend a campus orientation tour and undergo our brief diagnostic assessment.'
    },
    {
      icon: 'fas fa-graduation-cap',
      title: 'Learn',
      description: 'Gain specialized guidance, interactive projects, and high-quality tutoring.'
    },
    {
      icon: 'fas fa-globe',
      title: 'Lead',
      description: 'Graduate with honors and transition smoothly into elite universities worldwide.'
    }
  ];

  campusOfferings = [
    'Smart classrooms with interactive digital displays',
    'Advanced physics, chemistry, and biology research suites',
    'Olympic-sized swimming pool and indoor sports complex',
    'Rich digital library and quiet study capsules',
    '24/7 student health support and wellness counseling'
  ];

  schoolStats = [
    { icon: 'fas fa-user-graduate', value: '15K+', label: 'Successful Alumni' },
    { icon: 'fas fa-book', value: '350+', label: 'Courses Offered' },
    { icon: 'fas fa-trophy', value: '28', label: 'National Awards' },
    { icon: 'fas fa-school', value: '5', label: 'Campus Branches' }
  ];

  honorsCurriculum = [
    { course: 'AI Ethics & Society', description: 'Exploring machine learning implications' },
    { course: 'Advanced Calculus BC', description: 'Differential & integral calculus theory' },
    { course: 'World Literature & Drama', description: 'Analysis of classical and modern texts' },
    { course: 'Organic Chemistry Lab', description: 'Advanced synthesis & spectral analysis' },
    { course: 'Global Macroeconomics', description: 'Economic models, markets, and policy' }
  ];

  parentReviews = [
    {
      name: 'Dr. Vivek Sharma',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
      comment: 'Aether Academy has been a second home for my kids. The STEM lab curriculum is stellar, and their online admission process is extremely smooth!'
    },
    {
      name: 'Meera Deshmukh',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop',
      comment: 'Fascinated by their focus on holistic child development. The teachers do not just teach syllabus; they inspire curiosity and leadership traits.'
    },
    {
      name: 'Aditya Sen',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop',
      comment: 'The college counselor was instrumental in helping our daughter target and secure admission into Ivy League schools. Incredible mentorship!'
    }
  ];
}
