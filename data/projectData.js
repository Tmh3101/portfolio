export const projectData = {
  vi: [
    // 1. FLAGSHIP AI PRODUCT
    {
      id: 'vielora',
      title: 'Vielora - AI Chatbot SaaS Platform',
      tagline: 'Nền tảng AI Chatbot SaaS Multi-tenant & RAG Pipeline',
      summary:
        'Xây dựng hệ thống SaaS Multi-tenant hoàn chỉnh: RAG pipeline với hybrid search (vector + full-text), hàng đợi Redis/BullMQ cào dữ liệu ngầm không block luồng chính, tích hợp thanh toán tự động payOS và xuất hóa đơn điện tử EasyInvoice.',
      impact:
        'Kiến trúc multi-tenant workspace, Hybrid Search (pgvector + full-text PostgreSQL), hàng đợi cào dữ liệu bất đồng bộ (Redis/BullMQ), thanh toán tự động payOS & hóa đơn điện tử EasyInvoice.',
      tech: ['Next.js 14', 'TypeScript', 'Supabase', 'pgvector', 'Redis', 'BullMQ', 'Docker', 'Gemini API'],
      tags: ['Next.js 14', 'TypeScript', 'Supabase', 'pgvector', 'Redis', 'BullMQ', 'Docker', 'Gemini API'],
      featured: true,
      category: 'Flagship AI Product',
      status: 'Production Live',
      liveUrl: 'https://vielora.vn',
      repoUrl: null,
      githubUrl: null,
      image: '/assets/optimized/vielora.webp',
    },

    // 2. SOFTWARE ENGINEERING & SYSTEMS
    {
      id: 'slice-socialfi',
      title: 'Slice SocialFi - Token Bridge & Task Queue',
      tagline: 'Cầu nối tài sản Cross-chain & Hệ thống xử lý giao dịch an toàn',
      summary:
        'Thiết kế cầu nối token cross-chain giữa BNB Smart Chain và LensChain (Lock/Mint & Burn/Unlock). Xây dựng hàng đợi tác vụ Redis xử lý luồng giao dịch Fiat-to-Crypto bảo đảm tính toàn vẹn dữ liệu (zero data loss); container hóa Docker trên AWS EC2.',
      impact:
        'Cầu nối token xuyên chuỗi (BNB Chain ↔ LensChain) cơ chế Lock/Mint & Burn/Unlock. Hàng đợi task Redis xử lý giao dịch DNPAY Fiat-to-Crypto bảo đảm zero-data-loss. Container hóa microservices trên AWS EC2.',
      tech: ['Node.js', 'Hono', 'Viem', 'Solidity', 'Redis', 'PostgreSQL', 'AWS EC2', 'Docker'],
      tags: ['Node.js', 'Hono', 'Viem', 'Solidity', 'Redis', 'PostgreSQL', 'AWS EC2', 'Docker'],
      featured: true,
      category: 'Software Engineering',
      status: 'Enterprise Client',
      liveUrl: 'https://slicefi.xyz/',
      repoUrl: null,
      githubUrl: null,
      image: '/assets/optimized/slice-socialfi.webp',
    },
    {
      id: 'giftcards',
      title: 'Giftcards.vn - Corporate Gift Solutions',
      tagline: 'Giải pháp quà tặng doanh nghiệp & Cổng thanh toán',
      summary:
        'Tích hợp cổng thanh toán DNPAY Merchant, thiết kế cơ chế retry payment flow giảm thiểu tỷ lệ rớt đơn hàng, quản lý vòng đời đơn hàng quà tặng doanh nghiệp.',
      impact:
        'Tích hợp cổng thanh toán DNPAY Merchant, thiết kế cơ chế retry payment flow giảm thiểu tỷ lệ rớt đơn hàng, quản lý vòng đời đơn hàng quà tặng doanh nghiệp.',
      tech: ['NestJS', 'MongoDB', 'Redis', 'ReactJS'],
      tags: ['NestJS', 'MongoDB', 'Redis', 'ReactJS'],
      featured: false,
      category: 'Software Engineering',
      status: 'Enterprise Client',
      liveUrl: null,
      repoUrl: null,
      githubUrl: null,
      image: '/assets/optimized/giftcards.webp',
    },
    {
      id: 'identity-service',
      title: 'Enterprise Identity & Auth Microservice',
      tagline: 'Hệ thống định danh & phân quyền bảo mật cao bằng Java Spring Boot 3',
      summary:
        'Xây dựng dịch vụ định danh người dùng chuẩn RESTful theo kiến trúc phân tầng sạch sẽ. Triển khai xác thực JWT + OAuth2, phân quyền RBAC, cơ chế băm mật khẩu, xoay vòng refresh token và token revocation list.',
      impact:
        'Kiến trúc phân tầng chuẩn mực OOP, xác thực JWT + OAuth2, bảo vệ chống brute-force, refresh token rotation và danh sách thu hồi token (Token Revocation List).',
      tech: ['Java 17', 'Spring Boot 3', 'Spring Security', 'OAuth2', 'JWT', 'MySQL', 'Docker'],
      tags: ['Java 17', 'Spring Boot 3', 'Spring Security', 'OAuth2', 'JWT', 'MySQL', 'Docker'],
      featured: false,
      category: 'Software Engineering',
      status: 'Open Source',
      liveUrl: null,
      repoUrl: 'https://github.com/Tmh3101/user-service',
      githubUrl: 'https://github.com/Tmh3101/user-service',
      image: '/assets/optimized/identity-service.webp',
    },

    // 3. APPLIED AI & R&D
    {
      id: 'sybilsignal',
      title: 'SybilSignal - Graph-based Risk Detection',
      tagline: 'Hệ thống phát hiện tài khoản bất thường on-chain bằng Graph AI (9.8/10)',
      summary:
        'Trích xuất và tiền xử lý hàng triệu bản ghi on-chain Lens Protocol từ BigQuery sang đồ thị 4 tầng. Thiết kế kiến trúc tách rời (GATv2 + Random Forest) hóa giải hiện tượng over-smoothing và mất cân bằng nhãn; dashboard Next.js + FastAPI trực quan hóa Attention Weights.',
      impact:
        'Kiến trúc Decoupled GATv2 + Random Forest xử lý hàng triệu bản ghi on-chain BigQuery, khắc phục over-smoothing và mất cân bằng nhãn. Dashboard XAI attention weights thời gian thực. Điểm khóa luận 9.8/10.',
      tech: ['Python', 'PyTorch Geometric', 'FastAPI', 'BigQuery', 'Modal', 'Next.js'],
      tags: ['Python', 'PyTorch Geometric', 'FastAPI', 'BigQuery', 'Modal', 'Next.js'],
      featured: true,
      category: 'Applied AI Research',
      status: 'Graduation Thesis (9.8/10)',
      liveUrl: 'https://sybilsignal.vercel.app',
      repoUrl: 'https://github.com/Tmh3101/sybilsignal-app',
      githubUrl: 'https://github.com/Tmh3101/sybilsignal-app',
      reportUrl: 'https://drive.google.com/file/d/1YOmJeSeUQA0xQq--tOlI6aosKq5rHam8/view?usp=sharing',
      image: '/assets/optimized/sybilsignal.webp',
    },
    {
      id: 'xpervia',
      title: 'Xpervia - AI LMS & Recommender Engine',
      tagline: 'Nền tảng quản lý học tập tích hợp RAG Assistant & Gợi ý khóa học',
      summary:
        'Thực nghiệm đối sánh hiệu quả giữa Vanilla RAG và HyDE RAG; fine-tune mô hình ngôn ngữ mã nguồn mở Qwen2.5-1.5B trên dữ liệu bài học; xây dựng bộ gợi ý khóa học lai (Collaborative + Content-based).',
      impact:
        'LMS với RBAC đầy đủ, thử nghiệm đối sánh Vanilla RAG vs. HyDE RAG, fine-tune Qwen2.5-1.5B và bộ gợi ý khóa học lai (Collaborative + Content-based filtering).',
      tech: ['Django', 'DRF', 'Next.js', 'LangChain', 'Qwen2.5', 'PostgreSQL'],
      tags: ['Django', 'DRF', 'Next.js', 'LangChain', 'Qwen2.5', 'PostgreSQL'],
      featured: false,
      category: 'Applied AI Research',
      status: 'Completed',
      liveUrl: 'https://xpervia.vercel.app',
      repoUrl: 'https://github.com/Tmh3101/xpervia',
      githubUrl: 'https://github.com/Tmh3101/xpervia',
      image: '/assets/optimized/xpervia.webp',
    },
  ],
  en: [
    // 1. FLAGSHIP AI PRODUCT
    {
      id: 'vielora',
      title: 'Vielora - AI Chatbot SaaS Platform',
      tagline: 'Multi-tenant AI Chatbot SaaS & RAG Pipeline',
      summary:
        'End-to-end multi-tenant SaaS: RAG pipeline with hybrid search (pgvector + full-text), async Redis/BullMQ ingestion queue, automated payOS checkout and EasyInvoice VAT generation.',
      impact:
        'Multi-tenant workspace architecture, Hybrid Search (pgvector + PostgreSQL full-text), async crawl queue (Redis/BullMQ), automated payOS checkout & EasyInvoice VAT generation.',
      tech: ['Next.js 14', 'TypeScript', 'Supabase', 'pgvector', 'Redis', 'BullMQ', 'Docker', 'Gemini API'],
      tags: ['Next.js 14', 'TypeScript', 'Supabase', 'pgvector', 'Redis', 'BullMQ', 'Docker', 'Gemini API'],
      featured: true,
      category: 'Flagship AI Product',
      status: 'Production Live',
      liveUrl: 'https://vielora.vn',
      repoUrl: null,
      githubUrl: null,
      image: '/assets/optimized/vielora.webp',
    },

    // 2. SOFTWARE ENGINEERING & SYSTEMS
    {
      id: 'slice-socialfi',
      title: 'Slice SocialFi - Token Bridge & Task Queue',
      tagline: 'Cross-chain Token Bridge & Async Transaction Processing',
      summary:
        'Cross-chain token bridge between BNB Smart Chain and LensChain (Lock/Mint & Burn/Unlock). Redis task queue handling Fiat-to-Crypto transactions guaranteeing zero data loss; containerized Docker microservices on AWS EC2.',
      impact:
        'Cross-chain token bridge (BNB Chain ↔ LensChain) with Lock/Mint & Burn/Unlock mechanisms. Redis task queue handling DNPAY Fiat-to-Crypto transaction flow ensuring zero-data-loss. Docker microservices on AWS EC2.',
      tech: ['Node.js', 'Hono', 'Viem', 'Solidity', 'Redis', 'PostgreSQL', 'AWS EC2', 'Docker'],
      tags: ['Node.js', 'Hono', 'Viem', 'Solidity', 'Redis', 'PostgreSQL', 'AWS EC2', 'Docker'],
      featured: true,
      category: 'Software Engineering',
      status: 'Enterprise Client',
      liveUrl: 'https://slicefi.xyz/',
      repoUrl: null,
      githubUrl: null,
      image: '/assets/optimized/slice-socialfi.webp',
    },
    {
      id: 'giftcards',
      title: 'Giftcards.vn - Corporate Gift Solutions',
      tagline: 'Corporate Gift Solutions & Payment Gateway',
      summary:
        'Integrated DNPAY Merchant payment gateway, designed payment retry mechanism minimizing cart abandonment rate, managed corporate gift order lifecycle.',
      impact:
        'Integrated DNPAY Merchant payment gateway, designed payment retry mechanism minimizing cart abandonment rate, managed corporate gift order lifecycle.',
      tech: ['NestJS', 'MongoDB', 'Redis', 'ReactJS'],
      tags: ['NestJS', 'MongoDB', 'Redis', 'ReactJS'],
      featured: false,
      category: 'Software Engineering',
      status: 'Enterprise Client',
      liveUrl: null,
      repoUrl: null,
      githubUrl: null,
      image: '/assets/optimized/giftcards.webp',
    },
    {
      id: 'identity-service',
      title: 'Enterprise Identity & Auth Microservice',
      tagline: 'High-Security Enterprise Auth Microservice with Spring Boot 3',
      summary:
        'Layered OOP architecture, JWT + OAuth2 authentication, brute-force protection, refresh token rotation, and token revocation list preventing unauthorized token reuse.',
      impact:
        'Layered OOP architecture, JWT + OAuth2 authentication, brute-force protection, refresh token rotation, and token revocation list preventing unauthorized token reuse.',
      tech: ['Java 17', 'Spring Boot 3', 'Spring Security', 'OAuth2', 'JWT', 'MySQL', 'Docker'],
      tags: ['Java 17', 'Spring Boot 3', 'Spring Security', 'OAuth2', 'JWT', 'MySQL', 'Docker'],
      featured: false,
      category: 'Software Engineering',
      status: 'Open Source',
      liveUrl: null,
      repoUrl: 'https://github.com/Tmh3101/user-service',
      githubUrl: 'https://github.com/Tmh3101/user-service',
      image: '/assets/optimized/identity-service.webp',
    },

    // 3. APPLIED AI & R&D
    {
      id: 'sybilsignal',
      title: 'SybilSignal - Graph-based Risk Detection',
      tagline: 'Graph-based Web3 Fraud Detection (Thesis 9.8/10)',
      summary:
        'Extracted and preprocessed millions of Lens Protocol on-chain records from BigQuery into 4-layer graph. Decoupled GATv2 + Random Forest architecture resolving over-smoothing and label imbalance; Next.js + FastAPI dashboard visualizing Attention Weights.',
      impact:
        'Decoupled GATv2 + Random Forest architecture on millions of BigQuery on-chain records, resolving over-smoothing and label imbalance. Real-time XAI attention weights dashboard. Thesis score 9.8/10.',
      tech: ['Python', 'PyTorch Geometric', 'FastAPI', 'BigQuery', 'Modal', 'Next.js'],
      tags: ['Python', 'PyTorch Geometric', 'FastAPI', 'BigQuery', 'Modal', 'Next.js'],
      featured: true,
      category: 'Applied AI Research',
      status: 'Graduation Thesis (9.8/10)',
      liveUrl: 'https://sybilsignal.vercel.app',
      repoUrl: 'https://github.com/Tmh3101/sybilsignal-app',
      githubUrl: 'https://github.com/Tmh3101/sybilsignal-app',
      reportUrl: 'https://drive.google.com/file/d/1YOmJeSeUQA0xQq--tOlI6aosKq5rHam8/view?usp=sharing',
      image: '/assets/optimized/sybilsignal.webp',
    },
    {
      id: 'xpervia',
      title: 'Xpervia - AI LMS & Recommender Engine',
      tagline: 'Learning Management System & AI RAG Chatbot',
      summary:
        'Empirical comparison of Vanilla RAG vs. HyDE RAG; fine-tuned open-source Qwen2.5-1.5B on lesson domain data; built hybrid course recommender (Collaborative + Content-based filtering).',
      impact:
        'Full LMS with RBAC, comparative evaluation of Vanilla RAG vs. HyDE RAG, fine-tuned Qwen2.5-1.5B, and hybrid recommender system (Collaborative + Content-based filtering).',
      tech: ['Django', 'DRF', 'Next.js', 'LangChain', 'Qwen2.5', 'PostgreSQL'],
      tags: ['Django', 'DRF', 'Next.js', 'LangChain', 'Qwen2.5', 'PostgreSQL'],
      featured: false,
      category: 'Applied AI Research',
      status: 'Completed',
      liveUrl: 'https://xpervia.vercel.app',
      repoUrl: 'https://github.com/Tmh3101/xpervia',
      githubUrl: 'https://github.com/Tmh3101/xpervia',
      image: '/assets/optimized/xpervia.webp',
    },
  ],
};

export const projects = projectData.vi;
