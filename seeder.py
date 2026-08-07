"""
Seeder — pre-populates SQLite with questions, problems and a demo report.
Run once:  python3 backend/seeder.py
Or call seed_all() programmatically.
"""

import json
from database import get_db_connection

# ── MCQ Questions ─────────────────────────────────────────────────────────────
MCQ_QUESTIONS = [
    # DSA (10 questions)
    {"id": "mcq_dsa_1",  "topic": "DSA", "subtopic": "Time Complexity",
     "question": "What is the worst-case time complexity of QuickSort?",
     "options": ["O(N log N)", "O(N²)", "O(N)", "O(log N)"], "correct_answer": 1,
     "explanation": "In the worst case QuickSort degrades to O(N²) (already-sorted input)."},
    {"id": "mcq_dsa_2",  "topic": "DSA", "subtopic": "Arrays",
     "question": "Which data structure supports O(1) average-case lookup?",
     "options": ["Linked List", "Binary Search Tree", "Hash Table", "Stack"], "correct_answer": 2,
     "explanation": "Hash tables use a hash function for O(1) average-case lookups."},
    {"id": "mcq_dsa_3",  "topic": "DSA", "subtopic": "Trees",
     "question": "The height of a balanced binary tree with N nodes is:",
     "options": ["O(N)", "O(N²)", "O(log N)", "O(1)"], "correct_answer": 2,
     "explanation": "A balanced BST keeps height at O(log N)."},
    {"id": "mcq_dsa_4",  "topic": "DSA", "subtopic": "Graphs",
     "question": "Which algorithm finds the shortest path in an unweighted graph?",
     "options": ["DFS", "BFS", "Dijkstra", "Floyd-Warshall"], "correct_answer": 1,
     "explanation": "BFS naturally finds the shortest path (fewest edges) in an unweighted graph."},
    {"id": "mcq_dsa_5",  "topic": "DSA", "subtopic": "Sorting",
     "question": "What is the best-case time complexity of Bubble Sort?",
     "options": ["O(N²)", "O(N log N)", "O(N)", "O(1)"], "correct_answer": 2,
     "explanation": "Bubble Sort with early-exit flag runs in O(N) on an already-sorted array."},
    {"id": "mcq_dsa_6",  "topic": "DSA", "subtopic": "Dynamic Programming",
     "question": "Which of the following is NOT a characteristic of Dynamic Programming?",
     "options": ["Overlapping subproblems", "Optimal substructure", "Greedy choices", "Memoisation"], "correct_answer": 2,
     "explanation": "Greedy choices are a hallmark of Greedy algorithms, not DP."},
    {"id": "mcq_dsa_7",  "topic": "DSA", "subtopic": "Hashing",
     "question": "What collision resolution technique does Python's dict primarily use?",
     "options": ["Chaining", "Open addressing (linear probing)", "Robin Hood hashing", "Cuckoo hashing"], "correct_answer": 1,
     "explanation": "CPython dicts use open addressing with a pseudorandom probe sequence."},
    {"id": "mcq_dsa_8",  "topic": "DSA", "subtopic": "Stacks & Queues",
     "question": "Which data structure is used for DFS traversal?",
     "options": ["Queue", "Stack", "Heap", "Trie"], "correct_answer": 1,
     "explanation": "DFS uses a Stack (LIFO) either explicitly or via recursion."},
    {"id": "mcq_dsa_9",  "topic": "DSA", "subtopic": "Heap",
     "question": "What is the time complexity to extract the minimum from a Min-Heap?",
     "options": ["O(1)", "O(log N)", "O(N)", "O(N log N)"], "correct_answer": 1,
     "explanation": "Extraction (remove root) requires heapify-down — O(log N)."},
    {"id": "mcq_dsa_10", "topic": "DSA", "subtopic": "Tries",
     "question": "What is the time complexity to insert a word of length L into a Trie?",
     "options": ["O(1)", "O(L)", "O(N)", "O(N×L)"], "correct_answer": 1,
     "explanation": "Trie insertion visits each character exactly once — O(L)."},

    # Computer Networks (10 questions)
    {"id": "mcq_cn_1",  "topic": "Computer Networks", "subtopic": "OSI Model",
     "question": "Which layer of the OSI model handles logical addressing (IP)?",
     "options": ["Data Link", "Network", "Transport", "Session"], "correct_answer": 1,
     "explanation": "The Network layer (Layer 3) is responsible for logical (IP) addressing."},
    {"id": "mcq_cn_2",  "topic": "Computer Networks", "subtopic": "TCP/IP",
     "question": "What is the size of an IPv4 address?",
     "options": ["16 bits", "32 bits", "64 bits", "128 bits"], "correct_answer": 1,
     "explanation": "IPv4 addresses are 32 bits (4 octets)."},
    {"id": "mcq_cn_3",  "topic": "Computer Networks", "subtopic": "DNS",
     "question": "DNS operates primarily on which port?",
     "options": ["80", "443", "53", "22"], "correct_answer": 2,
     "explanation": "DNS uses UDP/TCP port 53."},
    {"id": "mcq_cn_4",  "topic": "Computer Networks", "subtopic": "HTTP",
     "question": "Which HTTP method is idempotent but NOT safe?",
     "options": ["GET", "PUT", "POST", "HEAD"], "correct_answer": 1,
     "explanation": "PUT is idempotent (repeating has same effect) but not safe (it modifies state)."},
    {"id": "mcq_cn_5",  "topic": "Computer Networks", "subtopic": "Protocols",
     "question": "Which protocol provides reliable, ordered delivery of packets?",
     "options": ["UDP", "ICMP", "TCP", "ARP"], "correct_answer": 2,
     "explanation": "TCP guarantees reliable, ordered, error-checked delivery."},
    {"id": "mcq_cn_6",  "topic": "Computer Networks", "subtopic": "Subnetting",
     "question": "How many usable host addresses does a /24 subnet provide?",
     "options": ["254", "256", "255", "128"], "correct_answer": 0,
     "explanation": "/24 = 256 addresses − 2 (network + broadcast) = 254 usable hosts."},
    {"id": "mcq_cn_7",  "topic": "Computer Networks", "subtopic": "TLS/SSL",
     "question": "Which of the following is asymmetric encryption?",
     "options": ["AES", "RSA", "DES", "Blowfish"], "correct_answer": 1,
     "explanation": "RSA is an asymmetric (public-key) algorithm; the rest are symmetric."},
    {"id": "mcq_cn_8",  "topic": "Computer Networks", "subtopic": "Routing",
     "question": "Which routing protocol uses the Bellman-Ford algorithm?",
     "options": ["OSPF", "BGP", "RIP", "EIGRP"], "correct_answer": 2,
     "explanation": "RIP (Routing Information Protocol) uses the Bellman-Ford distance-vector algorithm."},
    {"id": "mcq_cn_9",  "topic": "Computer Networks", "subtopic": "Congestion Control",
     "question": "TCP slow start doubles the congestion window every ___.",
     "options": ["Packet loss event", "Round-trip time (RTT)", "Second", "Minute"], "correct_answer": 1,
     "explanation": "During slow start the congestion window doubles every RTT until ssthresh."},
    {"id": "mcq_cn_10", "topic": "Computer Networks", "subtopic": "Application Layer",
     "question": "Which protocol is used to send email from client to server?",
     "options": ["IMAP", "POP3", "SMTP", "FTP"], "correct_answer": 2,
     "explanation": "SMTP (Simple Mail Transfer Protocol) is used to send email."},

    # OOPs (10 questions)
    {"id": "mcq_oops_1",  "topic": "OOPs", "subtopic": "Fundamentals",
     "question": "Which OOP concept lets a subclass redefine a parent method?",
     "options": ["Encapsulation", "Abstraction", "Polymorphism", "Inheritance"], "correct_answer": 2,
     "explanation": "Method overriding is a form of runtime polymorphism."},
    {"id": "mcq_oops_2",  "topic": "OOPs", "subtopic": "Inheritance",
     "question": "Python supports _______ inheritance.",
     "options": ["Single only", "Multiple", "Multilevel only", "Hierarchical only"], "correct_answer": 1,
     "explanation": "Python supports multiple inheritance via MRO (C3 linearisation)."},
    {"id": "mcq_oops_3",  "topic": "OOPs", "subtopic": "Encapsulation",
     "question": "A name-mangled attribute `__x` in Python is accessible as:",
     "options": ["obj.__x", "obj._ClassName__x", "obj.x", "obj.private_x"], "correct_answer": 1,
     "explanation": "Name mangling transforms __x to _ClassName__x to avoid accidental override."},
    {"id": "mcq_oops_4",  "topic": "OOPs", "subtopic": "Abstraction",
     "question": "Which Python module provides Abstract Base Classes?",
     "options": ["abstract", "abc", "typing", "interface"], "correct_answer": 1,
     "explanation": "The `abc` module provides the ABC class and @abstractmethod decorator."},
    {"id": "mcq_oops_5",  "topic": "OOPs", "subtopic": "Design Patterns",
     "question": "The Singleton pattern ensures:",
     "options": ["Multiple instances per class", "Exactly one instance per class", "Thread safety only", "Lazy evaluation only"], "correct_answer": 1,
     "explanation": "Singleton restricts class instantiation to a single object."},
    {"id": "mcq_oops_6",  "topic": "OOPs", "subtopic": "SOLID",
     "question": "The 'D' in SOLID stands for:",
     "options": ["Dependency Inversion", "Data Hiding", "Dynamic dispatch", "Dependency Injection"], "correct_answer": 0,
     "explanation": "Dependency Inversion Principle: depend on abstractions, not concretions."},
    {"id": "mcq_oops_7",  "topic": "OOPs", "subtopic": "Interfaces",
     "question": "In Java, a class can implement ________ interface(s).",
     "options": ["Only one", "Exactly two", "Multiple", "None — only abstract classes"], "correct_answer": 2,
     "explanation": "Java allows a class to implement multiple interfaces simultaneously."},
    {"id": "mcq_oops_8",  "topic": "OOPs", "subtopic": "Polymorphism",
     "question": "Operator overloading is an example of:",
     "options": ["Runtime polymorphism", "Compile-time polymorphism", "Dynamic dispatch", "Duck typing"], "correct_answer": 1,
     "explanation": "Operator overloading is resolved at compile time — compile-time (static) polymorphism."},
    {"id": "mcq_oops_9",  "topic": "OOPs", "subtopic": "Design Patterns",
     "question": "Which pattern defines a family of algorithms, encapsulates each, and makes them interchangeable?",
     "options": ["Observer", "Strategy", "Decorator", "Factory"], "correct_answer": 1,
     "explanation": "The Strategy pattern encapsulates algorithms behind a common interface."},
    {"id": "mcq_oops_10", "topic": "OOPs", "subtopic": "Memory",
     "question": "In C++, `virtual` keyword enables:",
     "options": ["Compile-time binding", "Runtime polymorphism via vtable", "Memory allocation", "Template instantiation"], "correct_answer": 1,
     "explanation": "`virtual` functions are dispatched at runtime via a vtable (virtual dispatch table)."},
]

# ── Coding Problems ────────────────────────────────────────────────────────────
CODING_PROBLEMS = [
    {
        "id": "dsa_two_sum", "title": "Two Sum — Target Pair", "difficulty": "EASY", "category": "Arrays & Hashing",
        "statement": "Given an integer array nums and an integer target, return the indices of the two numbers that add up to target. Each input has exactly one solution and you may not use the same element twice.",
        "constraints": ["2 ≤ nums.length ≤ 10⁴", "-10⁹ ≤ nums[i] ≤ 10⁹", "Only one valid answer exists"],
        "boilerplates": {
            "cpp":    "#include <iostream>\n#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nvector<int> twoSum(vector<int>& nums, int target) {\n    // TODO: Write your algorithm here\n    return {};\n}\n\nint main() {\n    // Input reading\n    int n, t;\n    cin >> n;\n    vector<int> nums(n);\n    for (int& x : nums) cin >> x;\n    cin >> t;\n    auto res = twoSum(nums, t);\n    cout << res[0] << \" \" << res[1] << endl;\n    return 0;\n}",
            "java":   "import java.util.*;\n\npublic class Solution {\n    public static int[] twoSum(int[] nums, int target) {\n        // TODO: Write your algorithm here\n        return new int[]{};\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        int target = sc.nextInt();\n        int[] res = twoSum(nums, target);\n        System.out.println(res[0] + \" \" + res[1]);\n    }\n}",
            "python": "import sys\nfrom typing import List\n\ndef two_sum(nums: List[int], target: int) -> List[int]:\n    # TODO: Write your algorithm here\n    pass\n\nif __name__ == '__main__':\n    data = sys.stdin.read().split()\n    n = int(data[0])\n    nums = list(map(int, data[1:n+1]))\n    target = int(data[n+1])\n    result = two_sum(nums, target)\n    print(result[0], result[1])",
        },
        "test_cases": [
            {"id": 1, "input": "4\n2 7 11 15\n9", "expectedOutput": "0 1", "isHidden": False},
            {"id": 2, "input": "3\n3 2 4\n6",     "expectedOutput": "1 2", "isHidden": False},
            {"id": 3, "input": "2\n3 3\n6",        "expectedOutput": "0 1", "isHidden": False},
            {"id": 4, "input": "5\n1 2 3 4 5\n9",  "expectedOutput": "3 4", "isHidden": True},
            {"id": 5, "input": "4\n-3 4 3 90\n0",  "expectedOutput": "0 2", "isHidden": True},
        ],
    },
    {
        "id": "dsa_max_subarray", "title": "Maximum Subarray (Kadane's)", "difficulty": "EASY", "category": "Dynamic Programming",
        "statement": "Given an integer array nums, find the contiguous subarray which has the largest sum and return its sum.",
        "constraints": ["1 ≤ nums.length ≤ 10⁵", "-10⁴ ≤ nums[i] ≤ 10⁴"],
        "boilerplates": {
            "cpp":    "#include <iostream>\n#include <vector>\n#include <climits>\nusing namespace std;\n\nint maxSubArray(vector<int>& nums) {\n    // TODO: Write your algorithm here\n    return 0;\n}\n\nint main() {\n    int n; cin >> n;\n    vector<int> nums(n);\n    for (int& x : nums) cin >> x;\n    cout << maxSubArray(nums) << endl;\n    return 0;\n}",
            "java":   "import java.util.*;\n\npublic class Solution {\n    public static int maxSubArray(int[] nums) {\n        // TODO: Write your algorithm here\n        return 0;\n    }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        System.out.println(maxSubArray(nums));\n    }\n}",
            "python": "import sys\nfrom typing import List\n\ndef max_subarray(nums: List[int]) -> int:\n    # TODO: Write your algorithm here\n    pass\n\nif __name__ == '__main__':\n    data = sys.stdin.read().split()\n    nums = list(map(int, data[1:]))\n    print(max_subarray(nums))",
        },
        "test_cases": [
            {"id": 1, "input": "9\n-2 1 -3 4 -1 2 1 -5 4", "expectedOutput": "6", "isHidden": False},
            {"id": 2, "input": "1\n1",                       "expectedOutput": "1", "isHidden": False},
            {"id": 3, "input": "5\n5 4 -1 7 8",              "expectedOutput": "23", "isHidden": False},
            {"id": 4, "input": "4\n-1 -2 -3 -4",             "expectedOutput": "-1", "isHidden": True},
            {"id": 5, "input": "6\n0 0 0 0 0 0",             "expectedOutput": "0",  "isHidden": True},
        ],
    },
    {
        "id": "dsa_valid_parens", "title": "Valid Parentheses", "difficulty": "MEDIUM", "category": "Stacks",
        "statement": "Given a string containing just '(', ')', '{', '}', '[', ']', determine if the input string is valid. An input string is valid if open brackets are closed in the correct order.",
        "constraints": ["1 ≤ s.length ≤ 10⁴", "s consists of parentheses only '()[]{}'"],
        "boilerplates": {
            "cpp":    "#include <iostream>\n#include <stack>\n#include <string>\nusing namespace std;\n\nbool isValid(string s) {\n    // TODO: Write your algorithm here\n    return false;\n}\n\nint main() {\n    string s; cin >> s;\n    cout << (isValid(s) ? \"true\" : \"false\") << endl;\n    return 0;\n}",
            "java":   "import java.util.*;\n\npublic class Solution {\n    public static boolean isValid(String s) {\n        // TODO: Write your algorithm here\n        return false;\n    }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        System.out.println(isValid(sc.nextLine()) ? \"true\" : \"false\");\n    }\n}",
            "python": "import sys\n\ndef is_valid(s: str) -> bool:\n    # TODO: Write your algorithm here\n    pass\n\nif __name__ == '__main__':\n    s = sys.stdin.read().strip()\n    print('true' if is_valid(s) else 'false')",
        },
        "test_cases": [
            {"id": 1, "input": "()",     "expectedOutput": "true",  "isHidden": False},
            {"id": 2, "input": "()[]{}",  "expectedOutput": "true",  "isHidden": False},
            {"id": 3, "input": "(]",      "expectedOutput": "false", "isHidden": False},
            {"id": 4, "input": "([)]",    "expectedOutput": "false", "isHidden": True},
            {"id": 5, "input": "{[]}",    "expectedOutput": "true",  "isHidden": True},
        ],
    },
    {
        "id": "dsa_lru_cache", "title": "LRU Cache", "difficulty": "HARD", "category": "Design & Data Structures",
        "statement": "Design a data structure that follows Least Recently Used (LRU) cache eviction. Implement LRUCache class with capacity, get(key) returning value or -1, and put(key, value) evicting LRU item when over capacity. Both operations must run in O(1).",
        "constraints": ["1 ≤ capacity ≤ 3000", "0 ≤ key ≤ 10⁴", "0 ≤ value ≤ 10⁵", "At most 2×10⁵ calls to get and put"],
        "boilerplates": {
            "cpp":    "#include <iostream>\n#include <unordered_map>\n#include <list>\nusing namespace std;\n\nclass LRUCache {\npublic:\n    int capacity;\n    // TODO: Write your data structure fields here\n\n    LRUCache(int cap) {\n        capacity = cap;\n        // TODO: initialise\n    }\n\n    int get(int key) {\n        // TODO: Write your algorithm here\n        return -1;\n    }\n\n    void put(int key, int value) {\n        // TODO: Write your algorithm here\n    }\n};\n\nint main() {\n    // Test your implementation here\n    LRUCache cache(2);\n    cache.put(1, 1);\n    cache.put(2, 2);\n    cout << cache.get(1) << endl; // 1\n    cache.put(3, 3);\n    cout << cache.get(2) << endl; // -1\n    return 0;\n}",
            "java":   "import java.util.*;\n\npublic class LRUCache {\n    // TODO: Write your data structure fields here\n\n    public LRUCache(int capacity) {\n        // TODO: initialise\n    }\n\n    public int get(int key) {\n        // TODO: Write your algorithm here\n        return -1;\n    }\n\n    public void put(int key, int value) {\n        // TODO: Write your algorithm here\n    }\n\n    public static void main(String[] args) {\n        LRUCache cache = new LRUCache(2);\n        cache.put(1, 1);\n        cache.put(2, 2);\n        System.out.println(cache.get(1));\n        cache.put(3, 3);\n        System.out.println(cache.get(2));\n    }\n}",
            "python": "from collections import OrderedDict\n\nclass LRUCache:\n    def __init__(self, capacity: int):\n        self.capacity = capacity\n        # TODO: Write your data structure here\n\n    def get(self, key: int) -> int:\n        # TODO: Write your algorithm here\n        return -1\n\n    def put(self, key: int, value: int) -> None:\n        # TODO: Write your algorithm here\n        pass\n\nif __name__ == '__main__':\n    cache = LRUCache(2)\n    cache.put(1, 1)\n    cache.put(2, 2)\n    print(cache.get(1))\n    cache.put(3, 3)\n    print(cache.get(2))",
        },
        "test_cases": [
            {"id": 1, "input": "capacity=2, ops: put(1,1) put(2,2) get(1)", "expectedOutput": "1",  "isHidden": False},
            {"id": 2, "input": "capacity=2, ops: put(1,1) put(2,2) put(3,3) get(2)", "expectedOutput": "-1", "isHidden": False},
            {"id": 3, "input": "capacity=1, ops: put(2,1) put(2,2) get(2)",           "expectedOutput": "2",  "isHidden": False},
            {"id": 4, "input": "capacity=2, ops: put(1,1) put(2,2) get(1) put(3,3) get(1) put(4,4) get(1)", "expectedOutput": "-1", "isHidden": True},
            {"id": 5, "input": "capacity=3, ops: put(1,1) put(2,2) put(3,3) put(4,4) get(4) get(3) get(2) get(1)", "expectedOutput": "-1", "isHidden": True},
        ],
    },
]

# ── HR & Comm Questions ────────────────────────────────────────────────────────
HR_COMM_QUESTIONS = [
    # HR (6)
    {"id": "hr_1",  "type": "HR",   "category": "Motivation",       "question": "Why do you want to work for us and what excites you most about this role?",                           "prep_seconds": 15, "answer_seconds": 150, "marks": 10},
    {"id": "hr_2",  "type": "HR",   "category": "Leadership",       "question": "Describe a situation where you led a team through a critical deadline. What was your approach?",       "prep_seconds": 15, "answer_seconds": 150, "marks": 10},
    {"id": "hr_3",  "type": "HR",   "category": "Conflict",         "question": "Tell me about a time you disagreed with a colleague or manager. How did you resolve it?",              "prep_seconds": 15, "answer_seconds": 150, "marks": 10},
    {"id": "hr_4",  "type": "HR",   "category": "Growth",           "question": "Where do you see yourself in 5 years, and how does this position align with that vision?",             "prep_seconds": 15, "answer_seconds": 150, "marks": 10},
    {"id": "hr_5",  "type": "HR",   "category": "Failure",          "question": "Walk me through your most significant professional failure and what you learned from it.",              "prep_seconds": 15, "answer_seconds": 150, "marks": 10},
    {"id": "hr_6",  "type": "HR",   "category": "Teamwork",         "question": "Describe a time you had to work with a difficult team member to deliver a project successfully.",       "prep_seconds": 15, "answer_seconds": 150, "marks": 10},
    # Communication (10)
    {"id": "comm_1",  "type": "COMM", "category": "Technical Clarity", "question": "Explain how the Internet works to someone who has never used a computer.",                          "prep_seconds": 15, "answer_seconds": 150, "marks": 10},
    {"id": "comm_2",  "type": "COMM", "category": "Structured Thinking","question": "Walk me through your step-by-step approach to debugging a slow API endpoint in production.",      "prep_seconds": 15, "answer_seconds": 150, "marks": 10},
    {"id": "comm_3",  "type": "COMM", "category": "Persuasion",         "question": "Convince me why Python is the best language for backend development.",                           "prep_seconds": 15, "answer_seconds": 150, "marks": 10},
    {"id": "comm_4",  "type": "COMM", "category": "Verbal Fluency",     "question": "Describe the most complex technical project you've worked on in under 90 seconds.",               "prep_seconds": 15, "answer_seconds": 150, "marks": 10},
    {"id": "comm_5",  "type": "COMM", "category": "Audience Adaptation","question": "How would you explain a microservices architecture to a non-technical CEO?",                     "prep_seconds": 15, "answer_seconds": 150, "marks": 10},
    {"id": "comm_6",  "type": "COMM", "category": "Active Listening",   "question": "A client calls insisting the bug is your fault, but your logs prove otherwise. How do you respond?", "prep_seconds": 15, "answer_seconds": 150, "marks": 10},
    {"id": "comm_7",  "type": "COMM", "category": "Feedback",           "question": "You receive harsh public criticism of your code in a code review. How do you respond?",         "prep_seconds": 15, "answer_seconds": 150, "marks": 10},
    {"id": "comm_8",  "type": "COMM", "category": "Negotiation",        "question": "Your manager asks you to deliver a feature in 2 days that normally takes a week. How do you negotiate?", "prep_seconds": 15, "answer_seconds": 150, "marks": 10},
    {"id": "comm_9",  "type": "COMM", "category": "Problem Statement",  "question": "State the problem of technical debt clearly and propose a prioritization framework for addressing it.", "prep_seconds": 15, "answer_seconds": 150, "marks": 10},
    {"id": "comm_10", "type": "COMM", "category": "Presentation",       "question": "Present a technical design for a URL shortener service (like bit.ly) — focus on clarity and structure.", "prep_seconds": 15, "answer_seconds": 150, "marks": 10},
]


def seed_all():
    conn = get_db_connection()
    c = conn.cursor()

    # Default user
    c.execute("INSERT OR IGNORE INTO users (id,name,email,password,target_role) VALUES (?,?,?,?,?)",
              ("usr_demo_1", "Alex Johnson", "alex.johnson@example.com", "password123", "Senior Full Stack Engineer"))

    # MCQ questions
    for q in MCQ_QUESTIONS:
        c.execute("INSERT OR REPLACE INTO mcq_questions (id,topic,subtopic,question,options,correct_answer,explanation) VALUES (?,?,?,?,?,?,?)",
                  (q["id"], q["topic"], q.get("subtopic",""), q["question"], json.dumps(q["options"]), q["correct_answer"], q.get("explanation","")))

    # Coding problems
    for p in CODING_PROBLEMS:
        c.execute("INSERT OR REPLACE INTO coding_problems (id,title,difficulty,category,statement,constraints,boilerplates,test_cases) VALUES (?,?,?,?,?,?,?,?)",
                  (p["id"], p["title"], p["difficulty"], p["category"], p["statement"], json.dumps(p["constraints"]), json.dumps(p["boilerplates"]), json.dumps(p["test_cases"])))

    # HR & Comm questions
    for h in HR_COMM_QUESTIONS:
        c.execute("INSERT OR REPLACE INTO hr_comm_questions (id,type,category,question,prep_seconds,answer_seconds,marks) VALUES (?,?,?,?,?,?,?)",
                  (h["id"], h["type"], h["category"], h["question"], h["prep_seconds"], h["answer_seconds"], h["marks"]))

    # Demo report
    c.execute("INSERT OR REPLACE INTO reports (id,user_id,target_role,overall_score,recommendation,scores_json,summary) VALUES (?,?,?,?,?,?,?)",
              ("rep_int_9921","usr_demo_1","Senior Full Stack Engineer",89,"STRONG HIRE",
               json.dumps({"hr":92,"dsa":85,"sysDesign":88,"comms":94,"resume":87}),
               "Candidate demonstrated exceptional analytical skills, optimal algorithm execution, and confident verbal delivery."))

    conn.commit()
    conn.close()
    print(f"✅ Seeded {len(MCQ_QUESTIONS)} MCQ questions, {len(CODING_PROBLEMS)} coding problems, {len(HR_COMM_QUESTIONS)} HR & Comm questions.")


if __name__ == "__main__":
    from database import init_db
    init_db()
    seed_all()
    print("🎉 Database seeding complete!")
