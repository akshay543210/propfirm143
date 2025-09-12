// Test file to demonstrate section assignment functionality
// This would normally be run in a Supabase environment

interface PropFirm {
  id: string;
  name: string;
  sections?: string[];
}

// Sample firms
const firms: PropFirm[] = [
  {
    id: "1",
    name: "FTMO",
    sections: ["topRated", "allFirms"]
  },
  {
    id: "2",
    name: "The Funded Trader",
    sections: ["budget", "allFirms"]
  },
  {
    id: "3",
    name: "MyForexFunds",
    sections: ["topRated", "budget"]
  }
];

// Function to get firms by section
const getFirmsBySection = (section: string): PropFirm[] => {
  return firms.filter(firm => firm.sections?.includes(section));
};

// Test the functionality
console.log("Budget firms:", getFirmsBySection("budget").map(f => f.name));
console.log("Top Rated firms:", getFirmsBySection("topRated").map(f => f.name));
console.log("All firms:", getFirmsBySection("allFirms").map(f => f.name));

// Function to update firm sections
const updateFirmSections = (firmId: string, sections: string[]) => {
  const firm = firms.find(f => f.id === firmId);
  if (firm) {
    firm.sections = sections;
  }
};

// Test updating sections
console.log("\nBefore updating FTMO sections:");
console.log("Budget firms:", getFirmsBySection("budget").map(f => f.name));

updateFirmSections("1", ["allFirms"]); // Remove FTMO from budget section

console.log("\nAfter removing FTMO from budget section:");
console.log("Budget firms:", getFirmsBySection("budget").map(f => f.name));
console.log("All firms:", getFirmsBySection("allFirms").map(f => f.name));
