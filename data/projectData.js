export const projectData = {
  vi: [
    // 1. FLAGSHIP AI PRODUCT
    {
      id: 'vielora',
      title: 'Vielora - AI Chatbot SaaS Platform',
      tagline: 'Nền tảng AI Chatbot SaaS Multi-tenant & RAG Pipeline',
      summary:
        'Xây dựng hệ thống AI Chatbot SaaS Multi-tenant hoàn chỉnh, giúp mọi người tạo trợ lý AI 24/7 nhanh chóng. Thiết kế RAG pipeline với hybrid search (vector + full-text) sử dụng pgvector, hàng đợi tác vụ nền (Redis/BullMQ), tích hợp Google Gemini API, thanh toán tự động payOS và xuất hóa đơn điện tử EasyInvoice.',
      impact:
        'Xây dựng hệ thống AI Chatbot SaaS Multi-tenant hoàn chỉnh, giúp mọi người tạo trợ lý AI 24/7 nhanh chóng. Thiết kế RAG pipeline với hybrid search (vector + full-text) sử dụng pgvector, hàng đợi tác vụ nền (Redis/BullMQ), tích hợp Google Gemini API, thanh toán tự động payOS và xuất hóa đơn điện tử EasyInvoice.',
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
      title: 'Slice SocialFi (SliceFi) - Cross-chain Bridge',
      tagline: 'Cross-chain bridge & Hệ thống xử lý giao dịch an toàn',
      summary:
        'Thiết kế cầu nối token cross-chain giữa BNB Smart Chain và LensChain (sử dụng cơ chế Lock/Mint & Burn/Unlock). Xây dựng hàng đợi tác vụ xử lý luồng giao dịch Fiat-to-Crypto (tích hợp nạp token DNPAY) bảo đảm tính toàn vẹn dữ liệu.',
      impact:
        'Thiết kế cầu nối token cross-chain giữa BNB Smart Chain và LensChain (sử dụng cơ chế Lock/Mint & Burn/Unlock). Xây dựng hàng đợi tác vụ xử lý luồng giao dịch Fiat-to-Crypto (tích hợp nạp token DNPAY) bảo đảm tính toàn vẹn dữ liệu.',
      tech: ['Node.js', 'Hono', 'Viem', 'Solidity', 'Redis', 'PostgreSQL', 'Docker'],
      tags: ['Node.js', 'Hono', 'Viem', 'Solidity', 'Redis', 'PostgreSQL', 'Docker'],
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
      tagline: 'Giải pháp quà tặng doanh nghiệp',
      summary:
        'Tích hợp cổng thanh toán DNPAY Merchant, thiết kế cơ chế retry payment flow giảm thiểu tỷ lệ rớt đơn hàng.',
      impact:
        'Tích hợp cổng thanh toán DNPAY Merchant, thiết kế cơ chế retry payment flow giảm thiểu tỷ lệ rớt đơn hàng.',
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

    // 3. APPLIED AI & R&D
    {
      id: 'sybilsignal',
      title: 'SybilSignal - Graph-based Risk Detection',
      tagline: 'Hệ thống phát hiện tài khoản bất thường trên Social Graph với mạng nơ ron đồ thị (9.8/10)',
      summary:
        'Trích xuất và tiền xử lý dữ liệu on-chain từ Lens Protocol với BigQuery, cấu trúc dữ liệu sang đồ thị 4 tầng. Thiết kế và thử nghiệm các kiến trúc tách rời (GATv2 + Random Forest); xây dựng dashboard Next.js + FastAPI trực quan hóa Attention Weights.',
      impact:
        'Trích xuất và tiền xử lý dữ liệu on-chain từ Lens Protocol với BigQuery, cấu trúc dữ liệu sang đồ thị 4 tầng. Thiết kế và thử nghiệm các kiến trúc tách rời (GATv2 + Random Forest); xây dựng dashboard Next.js + FastAPI trực quan hóa Attention Weights.',
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
        'Thiết kế và xây dựng hệ thống quản lý học tập (LMS) hoàn chỉnh. Thực nghiệm đối sánh hiệu quả giữa Vanilla RAG và HyDE RAG; fine-tune mô hình ngôn ngữ mã nguồn mở Qwen2.5-1.5B trên dữ liệu bài học; xây dựng bộ gợi ý khóa học lai (Collaborative + Content-based).',
      impact:
        'Thiết kế và xây dựng hệ thống quản lý học tập (LMS) hoàn chỉnh. Thực nghiệm đối sánh hiệu quả giữa Vanilla RAG và HyDE RAG; fine-tune mô hình ngôn ngữ mã nguồn mở Qwen2.5-1.5B trên dữ liệu bài học; xây dựng bộ gợi ý khóa học lai (Collaborative + Content-based).',
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
        'End-to-end multi-tenant AI Chatbot SaaS platform empowering quick 24/7 AI assistant creation. Designed RAG pipeline with hybrid search (pgvector + full-text), background task queues (Redis/BullMQ), Google Gemini API integration, automated payOS checkout, and EasyInvoice VAT generation.',
      impact:
        'End-to-end multi-tenant AI Chatbot SaaS platform empowering quick 24/7 AI assistant creation. Designed RAG pipeline with hybrid search (pgvector + full-text), background task queues (Redis/BullMQ), Google Gemini API integration, automated payOS checkout, and EasyInvoice VAT generation.',
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
      title: 'Slice SocialFi (SliceFi) - Cross-chain Bridge',
      tagline: 'Cross-chain bridge & Secure Transaction Processing System',
      summary:
        'Designed cross-chain token bridge between BNB Smart Chain and LensChain (using Lock/Mint & Burn/Unlock mechanism). Built task queue processing Fiat-to-Crypto transactions (integrated DNPAY token top-up) guaranteeing data integrity.',
      impact:
        'Designed cross-chain token bridge between BNB Smart Chain and LensChain (using Lock/Mint & Burn/Unlock mechanism). Built task queue processing Fiat-to-Crypto transactions (integrated DNPAY token top-up) guaranteeing data integrity.',
      tech: ['Node.js', 'Hono', 'Viem', 'Solidity', 'Redis', 'PostgreSQL', 'Docker'],
      tags: ['Node.js', 'Hono', 'Viem', 'Solidity', 'Redis', 'PostgreSQL', 'Docker'],
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
      tagline: 'Corporate Gift Solutions',
      summary:
        'Integrated DNPAY Merchant payment gateway, designed payment retry mechanism minimizing cart abandonment rate.',
      impact:
        'Integrated DNPAY Merchant payment gateway, designed payment retry mechanism minimizing cart abandonment rate.',
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

    // 3. APPLIED AI & R&D
    {
      id: 'sybilsignal',
      title: 'SybilSignal - Graph-based Risk Detection',
      tagline: 'Graph-based Sybil Detection on Social Graphs (Thesis 9.8/10)',
      summary:
        'Extracted and preprocessed on-chain Lens Protocol data with BigQuery, structured into 4-layer graph. Designed and evaluated decoupled architectures (GATv2 + Random Forest); built Next.js + FastAPI dashboard visualizing Attention Weights.',
      impact:
        'Extracted and preprocessed on-chain Lens Protocol data with BigQuery, structured into 4-layer graph. Designed and evaluated decoupled architectures (GATv2 + Random Forest); built Next.js + FastAPI dashboard visualizing Attention Weights.',
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
        'Designed and developed a complete Learning Management System (LMS). Conducted empirical comparison between Vanilla RAG and HyDE RAG; fine-tuned open-source Qwen2.5-1.5B on lesson domain data; built hybrid course recommender (Collaborative + Content-based filtering).',
      impact:
        'Designed and developed a complete Learning Management System (LMS). Conducted empirical comparison between Vanilla RAG and HyDE RAG; fine-tuned open-source Qwen2.5-1.5B on lesson domain data; built hybrid course recommender (Collaborative + Content-based filtering).',
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
