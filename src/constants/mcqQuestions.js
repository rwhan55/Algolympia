/**
 * mcqQuestions.js
 * Technical Question Bank for Round 1: Technical MCQ Round
 * Topics: Data Structures & Algorithms (DSA), Computer Networks (CN), Object-Oriented Programming (OOPs)
 * Total questions per session: 10
 * Total marks for Round 1: 80 marks (8 marks per question)
 * Duration: 25 minutes
 * Dynamic Question Switching: Questions and options are randomized on every test attempt.
 */

export const MCQ_QUESTION_BANK = [
  // ── DSA QUESTIONS (10) ──────────────────────────────────────────────────────────
  {
    id: 'mcq_dsa_1',
    topic: 'DSA',
    subtopic: 'Time Complexity',
    question: 'What is the worst-case time complexity of QuickSort when using a naive pivot selection (e.g., always choosing the last element)?',
    options: [
      'O(N log N)',
      'O(N²)',
      'O(N)',
      'O(log N)'
    ],
    correctAnswer: 1,
    explanation: 'In the worst case (e.g., already sorted array), naive QuickSort produces unbalanced partitions of size 0 and N-1, leading to O(N²) time complexity.'
  },
  {
    id: 'mcq_dsa_2',
    topic: 'DSA',
    subtopic: 'Trees & Graphs',
    question: 'In a Binary Search Tree (BST), which traversal order yields the elements in strictly ascending sorted order?',
    options: [
      'Pre-order Traversal',
      'Post-order Traversal',
      'In-order Traversal',
      'Level-order Traversal'
    ],
    correctAnswer: 2,
    explanation: 'In-order traversal visits Left Subtree -> Root -> Right Subtree, which yields elements in ascending order for any BST.'
  },
  {
    id: 'mcq_dsa_3',
    topic: 'DSA',
    subtopic: 'Graph Algorithms',
    question: "Which graph algorithm is used to find the single-source shortest path in a weighted graph with non-negative edge weights?",
    options: [
      "Dijkstra's Algorithm",
      'Bellman-Ford Algorithm',
      "Kruskal's Algorithm",
      'Floyd-Warshall Algorithm'
    ],
    correctAnswer: 0,
    explanation: "Dijkstra's algorithm finds the single-source shortest path efficiently in graphs with non-negative edge weights using a min-priority queue."
  },
  {
    id: 'mcq_dsa_4',
    topic: 'DSA',
    subtopic: 'Dynamic Programming',
    question: 'Which property MUST a problem exhibit for Dynamic Programming to be applicable?',
    options: [
      'Greedy choice property & sorted input',
      'Optimal substructure & overlapping subproblems',
      'Divide and conquer with independent subproblems',
      'Balanced search tree constraints'
    ],
    correctAnswer: 1,
    explanation: 'Dynamic Programming requires optimal substructure (optimal solution contains optimal sub-solutions) and overlapping subproblems.'
  },
  {
    id: 'mcq_dsa_5',
    topic: 'DSA',
    subtopic: 'Data Structures',
    question: 'Which of the following data structures is best suited for implementing a LIFO (Last-In, First-Out) mechanism?',
    options: [
      'Queue',
      'Stack',
      'Priority Queue',
      'Deque'
    ],
    correctAnswer: 1,
    explanation: 'A Stack strictly follows the LIFO (Last-In, First-Out) principle for operations.'
  },
  {
    id: 'mcq_dsa_6',
    topic: 'DSA',
    subtopic: 'Hashing',
    question: 'What is the average time complexity for insertion, deletion, and lookup operations in a well-distributed Hash Table?',
    options: [
      'O(log N)',
      'O(N)',
      'O(1)',
      'O(N log N)'
    ],
    correctAnswer: 2,
    explanation: 'With a good hash function and proper load factor, hash table operations execute in O(1) average time.'
  },
  {
    id: 'mcq_dsa_7',
    topic: 'DSA',
    subtopic: 'Heaps',
    question: "What is the time complexity to build a Max-Heap from an unsorted array of N elements using Floyd's build-heap algorithm?",
    options: [
      'O(N log N)',
      'O(N)',
      'O(N²)',
      'O(log N)'
    ],
    correctAnswer: 1,
    explanation: "Floyd's heap construction algorithm operates in O(N) linear time by sifting elements downward starting from the last non-leaf node."
  },
  {
    id: 'mcq_dsa_8',
    topic: 'DSA',
    subtopic: 'Disjoint Set Union (DSU)',
    question: 'With Path Compression and Union by Rank optimizations, what is the amortized time complexity per operation in a Disjoint Set Union (DSU)?',
    options: [
      'O(1)',
      'O(α(N)) — inverse Ackermann function',
      'O(log N)',
      'O(N)'
    ],
    correctAnswer: 1,
    explanation: 'With path compression and union by rank, DSU operations run in near-constant O(α(N)) amortized time.'
  },
  {
    id: 'mcq_dsa_9',
    topic: 'DSA',
    subtopic: 'Trie',
    question: 'Which data structure is optimal for autocomplete search suggestions and prefix matching operations across a dynamic dictionary of words?',
    options: [
      'AVL Tree',
      'Trie (Prefix Tree)',
      'Segment Tree',
      'B-Tree'
    ],
    correctAnswer: 1,
    explanation: 'A Trie (Prefix Tree) efficiently stores character sequences allowing prefix searches in O(L) time where L is word length.'
  },
  {
    id: 'mcq_dsa_10',
    topic: 'DSA',
    subtopic: 'String Searching',
    question: 'What is the time complexity of the Knuth-Morris-Pratt (KMP) string matching algorithm for a text of length N and pattern of length M?',
    options: [
      'O(N * M)',
      'O(N + M)',
      'O(N log M)',
      'O(N²)'
    ],
    correctAnswer: 1,
    explanation: 'KMP precomputes a longest prefix suffix (LPS) array in O(M) and searches text in O(N), yielding O(N + M) total time.'
  },

  // ── COMPUTER NETWORKS QUESTIONS (10) ───────────────────────────────────────────
  {
    id: 'mcq_cn_1',
    topic: 'Computer Networks',
    subtopic: 'OSI Model',
    question: 'Which layer of the OSI model is responsible for end-to-end communication, segmentation, flow control, and error detection (e.g. TCP/UDP)?',
    options: [
      'Network Layer (Layer 3)',
      'Transport Layer (Layer 4)',
      'Data Link Layer (Layer 2)',
      'Session Layer (Layer 5)'
    ],
    correctAnswer: 1,
    explanation: 'The Transport Layer (Layer 4) manages end-to-end communication, port addressing, segmentation, and reliability.'
  },
  {
    id: 'mcq_cn_2',
    topic: 'Computer Networks',
    subtopic: 'TCP/IP',
    question: 'What is the correct 3-way handshake process used by TCP to establish a reliable connection?',
    options: [
      'ACK -> SYN -> SYN-ACK',
      'SYN -> SYN-ACK -> ACK',
      'SYN -> ACK -> SYN-ACK',
      'FIN -> ACK -> FIN-ACK'
    ],
    correctAnswer: 1,
    explanation: 'TCP connection establishment follows: Client sends SYN, Server responds with SYN-ACK, Client sends ACK.'
  },
  {
    id: 'mcq_cn_3',
    topic: 'Computer Networks',
    subtopic: 'Protocols',
    question: 'Which protocol translates human-readable domain names (e.g., example.com) into numerical IP addresses?',
    options: [
      'DHCP',
      'ARP',
      'DNS',
      'NAT'
    ],
    correctAnswer: 2,
    explanation: 'DNS (Domain Name System) maps hostnames to IP addresses using a hierarchical distributed database.'
  },
  {
    id: 'mcq_cn_4',
    topic: 'Computer Networks',
    subtopic: 'Network Devices & ARP',
    question: 'What protocol is used to map an IP address (Logical Address) to a physical MAC address on a local network?',
    options: [
      'RARP',
      'ICMP',
      'ARP',
      'IGMP'
    ],
    correctAnswer: 2,
    explanation: 'ARP (Address Resolution Protocol) resolves Layer 3 IPv4 addresses into Layer 2 MAC physical addresses.'
  },
  {
    id: 'mcq_cn_5',
    topic: 'Computer Networks',
    subtopic: 'HTTP/HTTPS',
    question: 'What is the default port number used for secure HTTPS (HTTP over TLS/SSL) communications?',
    options: [
      '80',
      '8080',
      '443',
      '22'
    ],
    correctAnswer: 2,
    explanation: 'Port 443 is the standard port for encrypted HTTPS traffic, whereas HTTP uses port 80.'
  },
  {
    id: 'mcq_cn_6',
    topic: 'Computer Networks',
    subtopic: 'Subnetting',
    question: 'What is the network address for an IP address 192.168.1.135 with a CIDR subnet mask of /26 (255.255.255.192)?',
    options: [
      '192.168.1.0',
      '192.168.1.128',
      '192.168.1.64',
      '192.168.1.192'
    ],
    correctAnswer: 1,
    explanation: '/26 creates subnet blocks of size 64 (.0, .64, .128, .192). 135 lies in .128 to .191, so the network address is 192.168.1.128.'
  },
  {
    id: 'mcq_cn_7',
    topic: 'Computer Networks',
    subtopic: 'Flow Control',
    question: 'Which TCP flow control mechanism prevents a fast sender from overwhelming a slow receiver by using receiver window size (rwnd)?',
    options: [
      'Sliding Window Protocol',
      'Stop-and-Wait ARQ',
      'Slow Start Algorithm',
      'Nagle Algorithm'
    ],
    correctAnswer: 0,
    explanation: 'TCP uses the Sliding Window protocol to advertise its receiver buffer capacity (rwnd) so the sender throttling matches receiver capacity.'
  },
  {
    id: 'mcq_cn_8',
    topic: 'Computer Networks',
    subtopic: 'Routing Protocols',
    question: 'Which routing protocol algorithm is based on the Bellman-Ford equation to share routing tables with immediate neighbors (e.g., RIP)?',
    options: [
      'Link State Algorithm',
      'Distance Vector Algorithm',
      'Path Vector Algorithm',
      'Dijkstra Routing'
    ],
    correctAnswer: 1,
    explanation: 'Distance Vector routing protocols (like RIP) rely on the Bellman-Ford algorithm to periodically exchange vectors of distances with direct neighbors.'
  },
  {
    id: 'mcq_cn_9',
    topic: 'Computer Networks',
    subtopic: 'Application Protocols',
    question: 'Which protocol operates over UDP port 67/68 to automatically assign IP addresses, subnet masks, and default gateways to host devices?',
    options: [
      'DNS',
      'SNMP',
      'DHCP',
      'FTP'
    ],
    correctAnswer: 2,
    explanation: 'DHCP (Dynamic Host Configuration Protocol) automatically leases IP configurations to client endpoints using UDP ports 67 & 68.'
  },
  {
    id: 'mcq_cn_10',
    topic: 'Computer Networks',
    subtopic: 'Security & TLS',
    question: 'In TLS/SSL handshake, which mechanism allows the client and server to securely agree upon a shared symmetric session key over an insecure channel?',
    options: [
      'Diffie-Hellman Key Exchange',
      'RSA Digital Signatures',
      'AES Block Ciphering',
      'SHA-256 Hashing'
    ],
    correctAnswer: 0,
    explanation: 'Diffie-Hellman Key Exchange allows two parties to establish a shared secret key without ever sending the secret over the network.'
  },

  // ── OOPS CONCEPTS QUESTIONS (10) ───────────────────────────────────────────────
  {
    id: 'mcq_oops_1',
    topic: 'OOPs Concepts',
    subtopic: 'Polymorphism',
    question: 'Which mechanism in Object-Oriented Programming allows a method in a child class to provide a specific implementation of a method already defined in its parent class?',
    options: [
      'Method Overloading (Compile-time)',
      'Method Overriding (Run-time)',
      'Encapsulation',
      'Abstraction'
    ],
    correctAnswer: 1,
    explanation: 'Method Overriding is dynamic (run-time) polymorphism where a subclass redefines a method from its superclass with the exact same signature.'
  },
  {
    id: 'mcq_oops_2',
    topic: 'OOPs Concepts',
    subtopic: 'Encapsulation',
    question: 'What is the primary objective of Encapsulation in OOP?',
    options: [
      'To allow multiple classes to inherit properties from one base class',
      'To bind data and functions into a single unit while restricting direct access to object state',
      'To enable dynamic method binding at runtime',
      'To instantiate objects without invoking constructors'
    ],
    correctAnswer: 1,
    explanation: 'Encapsulation wraps data members and methods into a single class entity and hides internal representation using private access modifiers.'
  },
  {
    id: 'mcq_oops_3',
    topic: 'OOPs Concepts',
    subtopic: 'Inheritance & Diamond Problem',
    question: 'What is the "Diamond Problem" in Object-Oriented Programming, and how is it resolved in C++?',
    options: [
      'Ambiguity arising from multiple inheritance when two parent classes inherit from the same base class; resolved using virtual inheritance',
      'Memory leak caused by circular references; resolved using smart pointers',
      'Stack overflow in recursive constructors; resolved using lazy initialization',
      'Failure to override abstract methods; resolved using interfaces'
    ],
    correctAnswer: 0,
    explanation: 'The Diamond Problem occurs in multiple inheritance when a class inherits from two classes that share a common base. C++ uses virtual base classes (`virtual public Base`) to resolve it.'
  },
  {
    id: 'mcq_oops_4',
    topic: 'OOPs Concepts',
    subtopic: 'Abstraction vs Interface',
    question: 'Which of the following statements correctly distinguishes an Abstract Class from an Interface in Java?',
    options: [
      'An abstract class cannot contain concrete methods, whereas an interface can',
      'A class can inherit multiple abstract classes, but implement only one interface',
      'An abstract class can state variables and constructors, while an interface cannot hold instance state constructors',
      'Interfaces support default constructors while abstract classes do not'
    ],
    correctAnswer: 2,
    explanation: 'Abstract classes can hold state (instance fields) and constructors. Interfaces cannot have instance constructors.'
  },
  {
    id: 'mcq_oops_5',
    topic: 'OOPs Concepts',
    subtopic: 'SOLID Principles',
    question: 'Which SOLID principle states that "Software entities should be open for extension, but closed for modification"?',
    options: [
      'Single Responsibility Principle (SRP)',
      'Open/Closed Principle (OCP)',
      'Liskov Substitution Principle (LSP)',
      'Dependency Inversion Principle (DIP)'
    ],
    correctAnswer: 1,
    explanation: 'The Open/Closed Principle (OCP) advocates that system behavior can be extended without altering existing source code (e.g. through abstraction & interfaces).'
  },
  {
    id: 'mcq_oops_6',
    topic: 'OOPs Concepts',
    subtopic: 'Memory & Destructors',
    question: 'Why should a base class destructor always be declared as `virtual` when using polymorphism in C++?',
    options: [
      'To speed up object construction',
      'To prevent memory leaks by ensuring the derived class destructor is invoked when deleting via a base pointer',
      'To allow the base class to be instantiated',
      'To make all derived methods private'
    ],
    correctAnswer: 1,
    explanation: 'Deleting a derived class object through a pointer to a base class without a virtual destructor results in undefined behavior and memory leaks.'
  },
  {
    id: 'mcq_oops_7',
    topic: 'OOPs Concepts',
    subtopic: 'Coupling & Cohesion',
    question: 'In high-quality object-oriented architecture, software components should strive for:',
    options: [
      'High Coupling and Low Cohesion',
      'Low Coupling and High Cohesion',
      'High Coupling and High Cohesion',
      'Low Coupling and Low Cohesion'
    ],
    correctAnswer: 1,
    explanation: 'Low coupling minimizes dependencies between modules, and high cohesion ensures a module focuses on a single well-defined task.'
  },
  {
    id: 'mcq_oops_8',
    topic: 'OOPs Concepts',
    subtopic: 'Design Patterns',
    question: 'Which Creational Design Pattern ensures that a class has only one single instance globally and provides a global access point to it?',
    options: [
      'Factory Method',
      'Singleton Pattern',
      'Observer Pattern',
      'Adapter Pattern'
    ],
    correctAnswer: 1,
    explanation: 'The Singleton pattern restricts instantiation of a class to a single object instance across the application lifecycle.'
  },
  {
    id: 'mcq_oops_9',
    topic: 'OOPs Concepts',
    subtopic: 'Liskov Substitution',
    question: 'The Liskov Substitution Principle (LSP) dictates that:',
    options: [
      'Base classes should be replaced with interfaces',
      'Objects of a superclass should be replaceable with objects of a subclass without breaking application correctness',
      'Methods should accept no more than 3 parameters',
      'Classes must be declared final to prevent inheritance'
    ],
    correctAnswer: 1,
    explanation: 'LSP ensures that derived types can seamlessly substitute their base types without altering expected behavior or breaking code invariants.'
  },
  {
    id: 'mcq_oops_10',
    topic: 'OOPs Concepts',
    subtopic: 'Copy Constructor & Deep Copy',
    question: 'What is the main difference between a Shallow Copy and a Deep Copy when copying objects with dynamic memory allocations?',
    options: [
      'Shallow copy duplicates pointers pointing to shared memory, while Deep copy allocates new memory and duplicates values',
      'Deep copy only copies primitive types, whereas Shallow copy copies heap references',
      'Shallow copy invokes destructors automatically, whereas Deep copy requires garbage collection',
      'There is no difference in modern C++'
    ],
    correctAnswer: 0,
    explanation: 'A shallow copy copies field values including pointers (leading to double-free bugs), while a deep copy allocates new memory resources.'
  }
];

/**
 * Utility: Pick 10 randomized questions with variety across DSA, CN, and OOPs.
 * Questions and options are shuffled on every invocation so questions switch every time!
 */
export const getRandomMcqQuestions = (count = 10) => {
  const dsaQs = MCQ_QUESTION_BANK.filter(q => q.topic === 'DSA');
  const cnQs = MCQ_QUESTION_BANK.filter(q => q.topic === 'Computer Networks');
  const oopsQs = MCQ_QUESTION_BANK.filter(q => q.topic === 'OOPs Concepts');

  const shuffle = (arr) => [...arr].sort(() => 0.5 - Math.random());

  const pickedRaw = [
    ...shuffle(dsaQs).slice(0, 4),
    ...shuffle(cnQs).slice(0, 3),
    ...shuffle(oopsQs).slice(0, 3),
  ];

  if (pickedRaw.length < count) {
    const remaining = MCQ_QUESTION_BANK.filter(q => !pickedRaw.find(p => p.id === q.id));
    pickedRaw.push(...shuffle(remaining).slice(0, count - pickedRaw.length));
  }

  const finalQuestions = shuffle(pickedRaw).slice(0, count);

  // Return formatted clone with shuffled options for dynamic switching
  return finalQuestions.map((q) => {
    const originalCorrectOptionText = q.options[q.correctAnswer];
    const shuffledOptions = shuffle(q.options);
    const newCorrectIdx = shuffledOptions.indexOf(originalCorrectOptionText);
    return {
      ...q,
      options: shuffledOptions,
      correctAnswer: newCorrectIdx,
    };
  });
};
