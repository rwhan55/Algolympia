/**
 * codingProblems.js
 * Coding Problem Bank for Round 2: Proctored Coding Round
 * 3 Difficulty Levels: EASY, MEDIUM, HARD
 * Starter Boilerplates: Clean templates only — NO pre-written solution code!
 * Each problem contains exactly 5 test cases (10 marks per testcase = 50 marks total per problem)
 * Total Marks for Round 2 = 100 Marks (50 marks per question)
 */

export const CODING_PROBLEMS = [
  // ── EASY PROBLEMS ─────────────────────────────────────────────────────────
  {
    id: 'dsa_two_sum',
    title: 'Two Sum Target Pair',
    difficulty: 'EASY',
    category: 'Arrays & Hashing',
    timeLimit: '2.0s',
    memoryLimit: '256MB',
    statement: `Given an array of integers \`nums\` and an integer \`target\`, return the *indices of the two numbers such that they add up to \`target\`*.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice. Return the indices formatted as a space-separated pair (e.g., \`0 1\`).`,
    examples: [
      {
        id: 1,
        input: '4\n2 7 11 15\n9',
        output: '0 1',
        explanation: 'nums[0] + nums[1] = 2 + 7 = 9. Output indices: 0 1'
      },
      {
        id: 2,
        input: '3\n3 2 4\n6',
        output: '1 2',
        explanation: 'nums[1] + nums[2] = 2 + 4 = 6. Output indices: 1 2'
      }
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Exactly one valid solution exists.'
    ],
    boilerplates: {
      cpp: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];
    int target;
    cin >> target;

    // TODO: Write your algorithm here

    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();
        int target = sc.nextInt();

        // TODO: Write your algorithm here

    }
}`,
      python: `import sys

def main():
    input_data = sys.stdin.read().split()
    if not input_data:
        return
    n = int(input_data[0])
    nums = [int(x) for x in input_data[1:n+1]]
    target = int(input_data[n+1])

    # TODO: Write your algorithm here
    pass

if __name__ == '__main__':
    main()`
    },
    testCases: [
      { id: 1, input: '4\n2 7 11 15\n9', expectedOutput: '0 1', isHidden: false },
      { id: 2, input: '3\n3 2 4\n6', expectedOutput: '1 2', isHidden: false },
      { id: 3, input: '2\n3 3\n6', expectedOutput: '0 1', isHidden: true },
      { id: 4, input: '5\n-1 -2 -3 -4 -5\n-8', expectedOutput: '2 4', isHidden: true },
      { id: 5, input: '6\n10 20 30 40 50 60\n90', expectedOutput: '3 4', isHidden: true },
    ]
  },

  {
    id: 'dsa_valid_palindrome',
    title: 'Valid Palindrome String',
    difficulty: 'EASY',
    category: 'Strings & Two Pointers',
    timeLimit: '1.0s',
    memoryLimit: '128MB',
    statement: `A phrase is a **palindrome** if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.

Given a single-line string \`s\`, print \`true\` if it is a palindrome, or \`false\` otherwise.`,
    examples: [
      {
        id: 1,
        input: 'A man, a plan, a canal: Panama',
        output: 'true',
        explanation: 'After cleaning: "amanaplanacanalpanama" which is a palindrome.'
      }
    ],
    constraints: ['1 <= s.length <= 2 * 10^5'],
    boilerplates: {
      cpp: `#include <iostream>
#include <string>
using namespace std;

int main() {
    string s;
    getline(cin, s);

    // TODO: Write your algorithm here
    // Print "true" or "false"

    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.hasNextLine() ? sc.nextLine() : "";

        // TODO: Write your algorithm here
        // Print "true" or "false"

    }
}`,
      python: `import sys

def main():
    s = sys.stdin.read().strip()

    # TODO: Write your algorithm here
    # Print "true" or "false"
    pass

if __name__ == '__main__':
    main()`
    },
    testCases: [
      { id: 1, input: 'A man, a plan, a canal: Panama', expectedOutput: 'true', isHidden: false },
      { id: 2, input: 'race a car', expectedOutput: 'false', isHidden: false },
      { id: 3, input: ' ', expectedOutput: 'true', isHidden: true },
      { id: 4, input: '0P', expectedOutput: 'false', isHidden: true },
      { id: 5, input: 'No lemon, no melon', expectedOutput: 'true', isHidden: true },
    ]
  },

  // ── MEDIUM PROBLEMS ───────────────────────────────────────────────────────
  {
    id: 'dsa_lru_cache',
    title: 'LRU Cache Eviction Policy',
    difficulty: 'MEDIUM',
    category: 'Design & Linked List',
    timeLimit: '2.0s',
    memoryLimit: '256MB',
    statement: `Design a Least Recently Used (LRU) Cache mechanism with a given capacity.
Input consists of:
1. Capacity \`K\`
2. Number of commands \`N\`
3. \`N\` lines of commands: \`PUT key value\` or \`GET key\`.

Print the result of each \`GET\` command on a new line (print \`-1\` if key is not found).`,
    examples: [
      {
        id: 1,
        input: '2\n5\nPUT 1 10\nPUT 2 20\nGET 1\nPUT 3 30\nGET 2',
        output: '10\n-1',
        explanation: 'Capacity 2. Key 2 is evicted when Key 3 is put.'
      }
    ],
    constraints: ['1 <= capacity <= 1000', '1 <= operations <= 5000'],
    boilerplates: {
      cpp: `#include <iostream>
#include <string>
using namespace std;

class LRUCache {
public:
    LRUCache(int capacity) {
        // TODO: Initialize data structure
    }
    
    int get(int key) {
        // TODO: Return value if exists, else -1
        return -1;
    }
    
    void put(int key, int value) {
        // TODO: Insert/update key-value pair
    }
};

int main() {
    int cap, n;
    if (!(cin >> cap >> n)) return 0;
    LRUCache cache(cap);
    while (n--) {
        string cmd;
        cin >> cmd;
        if (cmd == "PUT") {
            int k, v; cin >> k >> v;
            cache.put(k, v);
        } else if (cmd == "GET") {
            int k; cin >> k;
            cout << cache.get(k) << endl;
        }
    }
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    static class LRUCache {
        public LRUCache(int capacity) {
            // TODO: Initialize data structure
        }
        public int getVal(int key) {
            // TODO: Implement get logic
            return -1;
        }
        public void putVal(int key, int val) {
            // TODO: Implement put logic
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int cap = sc.nextInt();
        int n = sc.nextInt();
        LRUCache cache = new LRUCache(cap);
        for (int i = 0; i < n; i++) {
            String cmd = sc.next();
            if (cmd.equals("PUT")) {
                cache.putVal(sc.nextInt(), sc.nextInt());
            } else {
                System.out.println(cache.getVal(sc.nextInt()));
            }
        }
    }
}`,
      python: `import sys

class LRUCache:
    def __init__(self, capacity: int):
        # TODO: Initialize data structure
        pass

    def get(self, key: int) -> int:
        # TODO: Implement get logic
        return -1

    def put(self, key: int, value: int) -> None:
        # TODO: Implement put logic
        pass

def main():
    tokens = sys.stdin.read().split()
    if not tokens:
        return
    cap = int(tokens[0])
    n = int(tokens[1])
    cache = LRUCache(cap)
    idx = 2
    for _ in range(n):
        cmd = tokens[idx]
        if cmd == "PUT":
            cache.put(int(tokens[idx+1]), int(tokens[idx+2]))
            idx += 3
        elif cmd == "GET":
            print(cache.get(int(tokens[idx+1])))
            idx += 2

if __name__ == '__main__':
    main()`
    },
    testCases: [
      { id: 1, input: '2\n5\nPUT 1 10\nPUT 2 20\nGET 1\nPUT 3 30\nGET 2', expectedOutput: '10\n-1', isHidden: false },
      { id: 2, input: '1\n4\nPUT 5 50\nGET 5\nPUT 6 60\nGET 5', expectedOutput: '50\n-1', isHidden: false },
      { id: 3, input: '2\n6\nPUT 1 1\nPUT 2 2\nGET 1\nPUT 3 3\nGET 2\nGET 3', expectedOutput: '1\n-1\n3', isHidden: true },
      { id: 4, input: '3\n5\nPUT 10 100\nPUT 20 200\nPUT 30 300\nGET 10\nGET 40', expectedOutput: '100\n-1', isHidden: true },
      { id: 5, input: '2\n7\nPUT 2 1\nPUT 2 2\nGET 2\nPUT 1 1\nPUT 4 1\nGET 2\nGET 4', expectedOutput: '2\n-1\n1', isHidden: true },
    ]
  },

  {
    id: 'dsa_longest_substring',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'MEDIUM',
    category: 'Sliding Window & Hash Set',
    timeLimit: '1.5s',
    memoryLimit: '128MB',
    statement: `Given a string \`s\`, find the length of the **longest substring** without duplicate characters.`,
    examples: [
      {
        id: 1,
        input: 'abcabcbb',
        output: '3',
        explanation: 'The answer is "abc", with the length of 3.'
      }
    ],
    constraints: ['0 <= s.length <= 5 * 10^4'],
    boilerplates: {
      cpp: `#include <iostream>
#include <string>
using namespace std;

int main() {
    string s;
    if (cin >> s) {
        // TODO: Find length of longest substring without repeating characters
    } else {
        cout << 0 << endl;
    }
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.hasNext() ? sc.next() : "";

        // TODO: Find length of longest substring without repeating characters

    }
}`,
      python: `import sys

def main():
    s = sys.stdin.read().strip()

    # TODO: Find length of longest substring without repeating characters
    pass

if __name__ == '__main__':
    main()`
    },
    testCases: [
      { id: 1, input: 'abcabcbb', expectedOutput: '3', isHidden: false },
      { id: 2, input: 'bbbbb', expectedOutput: '1', isHidden: false },
      { id: 3, input: 'pwwkew', expectedOutput: '3', isHidden: true },
      { id: 4, input: 'au', expectedOutput: '2', isHidden: true },
      { id: 5, input: 'dvdf', expectedOutput: '3', isHidden: true },
    ]
  },

  // ── HARD PROBLEMS ─────────────────────────────────────────────────────────
  {
    id: 'dsa_longest_valid_parens',
    title: 'Longest Valid Parentheses Substring',
    difficulty: 'HARD',
    category: 'Stack & Dynamic Programming',
    timeLimit: '2.0s',
    memoryLimit: '256MB',
    statement: `Given a string containing just the characters \`'('\` and \`')'\`, find the length of the **longest valid (well-formed) parentheses substring**.`,
    examples: [
      {
        id: 1,
        input: '(()',
        output: '2',
        explanation: 'Longest valid parentheses substring is "()".'
      },
      {
        id: 2,
        input: ')()())',
        output: '4',
        explanation: 'Longest valid parentheses substring is "()()".'
      }
    ],
    constraints: ['0 <= s.length <= 3 * 10^4', 's[i] is "(" or ")".'],
    boilerplates: {
      cpp: `#include <iostream>
#include <string>
using namespace std;

int main() {
    string s;
    if (cin >> s) {
        // TODO: Find length of longest valid parentheses substring
    } else {
        cout << 0 << endl;
    }
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.hasNext() ? sc.next() : "";

        // TODO: Find length of longest valid parentheses substring

    }
}`,
      python: `import sys

def main():
    s = sys.stdin.read().strip()

    # TODO: Find length of longest valid parentheses substring
    pass

if __name__ == '__main__':
    main()`
    },
    testCases: [
      { id: 1, input: '(()', expectedOutput: '2', isHidden: false },
      { id: 2, input: ')()())', expectedOutput: '4', isHidden: false },
      { id: 3, input: '', expectedOutput: '0', isHidden: true },
      { id: 4, input: '()(()', expectedOutput: '2', isHidden: true },
      { id: 5, input: '((()))()', expectedOutput: '8', isHidden: true },
    ]
  },

  {
    id: 'dsa_merge_k_sorted_lists',
    title: 'Merge K Sorted Arrays',
    difficulty: 'HARD',
    category: 'Heaps & Priority Queue',
    timeLimit: '2.5s',
    memoryLimit: '256MB',
    statement: `Given \`K\` sorted arrays of integers, merge all of them into a single sorted array and output the resulting elements space-separated.`,
    examples: [
      {
        id: 1,
        input: '3\n3 1 4 5\n3 1 3 4\n2 2 6',
        output: '1 1 2 3 4 4 5 6',
        explanation: 'Merging [1,4,5], [1,3,4], and [2,6] results in [1,1,2,3,4,4,5,6].'
      }
    ],
    constraints: ['1 <= K <= 500', 'Total elements N <= 10^5'],
    boilerplates: {
      cpp: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    int k;
    if (!(cin >> k)) return 0;

    // TODO: Merge K sorted arrays and print space-separated result

    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int k = sc.nextInt();

        // TODO: Merge K sorted arrays and print space-separated result

    }
}`,
      python: `import sys

def main():
    tokens = sys.stdin.read().split()
    if not tokens:
        return
    k = int(tokens[0])

    # TODO: Merge K sorted arrays and print space-separated result
    pass

if __name__ == '__main__':
    main()`
    },
    testCases: [
      { id: 1, input: '3\n3 1 4 5\n3 1 3 4\n2 2 6', expectedOutput: '1 1 2 3 4 4 5 6', isHidden: false },
      { id: 2, input: '2\n2 1 10\n2 2 5', expectedOutput: '1 2 5 10', isHidden: false },
      { id: 3, input: '1\n4 9 3 7 1', expectedOutput: '1 3 7 9', isHidden: true },
      { id: 4, input: '4\n1 5\n1 2\n1 8\n1 1', expectedOutput: '1 2 5 8', isHidden: true },
      { id: 5, input: '3\n2 -5 0\n2 -10 10\n1 0', expectedOutput: '-10 -5 0 0 10', isHidden: true },
    ]
  }
];

export const getProblemsByDifficulty = (difficulty = 'EASY') => {
  const norm = difficulty.toUpperCase();
  const matched = CODING_PROBLEMS.filter(p => p.difficulty === norm);
  const pool = matched.length >= 2 ? matched : CODING_PROBLEMS;
  const shuffle = (arr) => [...arr].sort(() => 0.5 - Math.random());
  return shuffle(pool).slice(0, 2);
};

export const getProblemById = (id) => {
  return CODING_PROBLEMS.find(p => p.id === id) || CODING_PROBLEMS[0];
};
