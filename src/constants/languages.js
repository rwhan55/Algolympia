/**
 * Language starters - EMPTY stubs only. No solution logic.
 * Candidates must write their own implementation.
 */
export const SUPPORTED_LANGUAGES = [
  {
    id: 'python',
    name: 'Python 3',
    monacoLanguage: 'python',
    pistonLang: 'python',
    pistonVersion: '3.10.0',
    extension: 'py',
    defaultCode: `# Your solution here
# Read the problem statement on the left carefully before coding.

class Solution:
    def solve(self, nums: list[int], target: int) -> list[int]:
        # TODO: Write your solution
        pass


# Test your solution
if __name__ == "__main__":
    sol = Solution()
    # Modify inputs below to test
    print(sol.solve([2, 7, 11, 15], 9))
`
  },
  {
    id: 'javascript',
    name: 'JavaScript (Node.js)',
    monacoLanguage: 'javascript',
    pistonLang: 'javascript',
    pistonVersion: '18.15.0',
    extension: 'js',
    defaultCode: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function solve(nums, target) {
  // TODO: Write your solution
}

// Test your solution
console.log(solve([2, 7, 11, 15], 9));
`
  },
  {
    id: 'cpp',
    name: 'C++',
    monacoLanguage: 'cpp',
    pistonLang: 'c++',
    pistonVersion: '10.2.0',
    extension: 'cpp',
    defaultCode: `#include <iostream>
#include <vector>
using namespace std;

class Solution {
public:
    vector<int> solve(vector<int>& nums, int target) {
        // TODO: Write your solution
        return {};
    }
};

int main() {
    Solution sol;
    vector<int> nums = {2, 7, 11, 15};
    vector<int> res = sol.solve(nums, 9);
    for (int idx : res) cout << idx << " ";
    cout << endl;
    return 0;
}
`
  },
  {
    id: 'java',
    name: 'Java',
    monacoLanguage: 'java',
    pistonLang: 'java',
    pistonVersion: '15.0.2',
    extension: 'java',
    defaultCode: `import java.util.*;

public class Main {
    public static int[] solve(int[] nums, int target) {
        // TODO: Write your solution
        return new int[]{};
    }

    public static void main(String[] args) {
        int[] result = solve(new int[]{2, 7, 11, 15}, 9);
        System.out.println(Arrays.toString(result));
    }
}
`
  },
  {
    id: 'c',
    name: 'C',
    monacoLanguage: 'c',
    pistonLang: 'c',
    pistonVersion: '10.2.0',
    extension: 'c',
    defaultCode: `#include <stdio.h>
#include <stdlib.h>

void solve(int* nums, int size, int target) {
    // TODO: Write your solution
}

int main() {
    int nums[] = {2, 7, 11, 15};
    solve(nums, 4, 9);
    return 0;
}
`
  },
  {
    id: 'go',
    name: 'Go',
    monacoLanguage: 'go',
    pistonLang: 'go',
    pistonVersion: '1.16.2',
    extension: 'go',
    defaultCode: `package main

import "fmt"

func solve(nums []int, target int) []int {
	// TODO: Write your solution
	return nil
}

func main() {
	result := solve([]int{2, 7, 11, 15}, 9)
	fmt.Println(result)
}
`
  },
  {
    id: 'rust',
    name: 'Rust',
    monacoLanguage: 'rust',
    pistonLang: 'rust',
    pistonVersion: '1.68.2',
    extension: 'rs',
    defaultCode: `fn solve(nums: Vec<i32>, target: i32) -> Vec<i32> {
    // TODO: Write your solution
    vec![]
}

fn main() {
    let result = solve(vec![2, 7, 11, 15], 9);
    println!("{:?}", result);
}
`
  }
];

export const getLanguageById = (id) => {
  return SUPPORTED_LANGUAGES.find(l => l.id === id) || SUPPORTED_LANGUAGES[0];
};
