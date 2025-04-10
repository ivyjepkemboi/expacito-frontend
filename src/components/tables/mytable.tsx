import { ReactNode } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Link } from "react-router";

// Types
interface Order {
  id: number;
  user: {
    image: string;
    name: string;
    role: string;
  };
  projectName: string;
  team: {
    images: string[];
  };
  status: string;
  budget: string;
}

interface TableProps {
  children: ReactNode;
  className?: string;
}

interface TableHeaderProps {
  children: ReactNode;
  className?: string;
}

interface TableBodyProps {
  children: ReactNode;
  className?: string;
}

interface TableRowProps {
  children: ReactNode;
  className?: string;
}

interface TableCellProps {
  children: ReactNode;
  isHeader?: boolean;
  className?: string;
}

interface ComponentCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  desc?: string;
}

interface BreadcrumbProps {
  pageTitle: string;
}

// Reusable Table Components
const Table = ({ children, className }: TableProps) => (
  <table className={`min-w-full ${className}`}>{children}</table>
);

const TableHeader = ({ children, className }: TableHeaderProps) => (
  <thead className={className}>{children}</thead>
);

const TableBody = ({ children, className }: TableBodyProps) => (
  <tbody className={className}>{children}</tbody>
);

const TableRow = ({ children, className }: TableRowProps) => (
  <tr className={className}>{children}</tr>
);

const TableCell = ({ children, isHeader = false, className }: TableCellProps) => {
  const Tag = isHeader ? "th" : "td";
  return <Tag className={className}>{children}</Tag>;
};

// Badge Component
const Badge = ({
  color,
  children,
  size = "sm",
}: {
  color: "success" | "warning" | "error";
  children: ReactNode;
  size?: "sm" | "md" | "lg";
}) => {
  const colors = {
    success: "bg-green-100 text-green-600",
    warning: "bg-yellow-100 text-yellow-600",
    error: "bg-red-100 text-red-600",
  };

  const sizes = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-1.5",
  };

  return (
    <span
      className={`inline-block rounded-full font-medium ${colors[color]} ${sizes[size]}`}
    >
      {children}
    </span>
  );
};

// ComponentCard
const ComponentCard = ({ title, children, className = "", desc = "" }: ComponentCardProps) => (
  <div className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] ${className}`}>
    <div className="px-6 py-5">
      <h3 className="text-base font-medium text-gray-800 dark:text-white/90">{title}</h3>
      {desc && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{desc}</p>}
    </div>
    <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
      <div className="space-y-6">{children}</div>
    </div>
  </div>
);

// Breadcrumb
const PageBreadcrumb = ({ pageTitle }: BreadcrumbProps) => (
  <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
    <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">{pageTitle}</h2>
    <nav>
      <ol className="flex items-center gap-1.5">
        <li>
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
            Home
            <svg className="stroke-current" width="17" height="16" viewBox="0 0 17 16" fill="none">
              <path d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </li>
        <li className="text-sm text-gray-800 dark:text-white/90">{pageTitle}</li>
      </ol>
    </nav>
  </div>
);

// Meta Tags
const PageMeta = ({ title, description }: { title: string; description: string }) => (
  <Helmet>
    <title>{title}</title>
    <meta name="description" content={description} />
  </Helmet>
);

// Main Component
export default function CategoriesManager() {
  const tableData: Order[] = [
    {
      id: 1,
      user: { image: "/images/user/user-17.jpg", name: "Lindsey Curtis", role: "Web Designer" },
      projectName: "Agency Website",
      team: { images: ["/images/user/user-22.jpg", "/images/user/user-23.jpg", "/images/user/user-24.jpg"] },
      budget: "3.9K",
      status: "Active",
    },
    {
      id: 2,
      user: { image: "/images/user/user-18.jpg", name: "Kaiya George", role: "Project Manager" },
      projectName: "Technology",
      team: { images: ["/images/user/user-25.jpg", "/images/user/user-26.jpg"] },
      budget: "24.9K",
      status: "Pending",
    },
    {
      id: 3,
      user: { image: "/images/user/user-17.jpg", name: "Zain Geidt", role: "Content Writing" },
      projectName: "Blog Writing",
      team: { images: ["/images/user/user-27.jpg"] },
      budget: "12.7K",
      status: "Active",
    },
    {
      id: 4,
      user: { image: "/images/user/user-20.jpg", name: "Abram Schleifer", role: "Digital Marketer" },
      projectName: "Social Media",
      team: { images: ["/images/user/user-28.jpg", "/images/user/user-29.jpg", "/images/user/user-30.jpg"] },
      budget: "2.8K",
      status: "Cancel",
    },
    {
      id: 5,
      user: { image: "/images/user/user-21.jpg", name: "Carla George", role: "Front-end Developer" },
      projectName: "Website",
      team: { images: ["/images/user/user-31.jpg", "/images/user/user-32.jpg", "/images/user/user-33.jpg"] },
      budget: "4.5K",
      status: "Active",
    },
  ];

  return (
    <HelmetProvider>
      <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin"
        description="This is React.js Basic Tables Dashboard page for TailAdmin"
      />
      <PageBreadcrumb pageTitle="Basic Tables" />
      <ComponentCard title="Basic Table 1">
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="max-w-full overflow-x-auto">
            <div className="min-w-[1102px]">
              <Table>
                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                  <TableRow>
                    {["User", "Project Name", "Team", "Status", "Budget"].map((heading) => (
                      <TableCell
                        key={heading}
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                      >
                        {heading}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {tableData.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 overflow-hidden rounded-full">
                            <img src={order.user.image} alt={order.user.name} width={40} height={40} />
                          </div>
                          <div>
                            <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                              {order.user.name}
                            </span>
                            <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                              {order.user.role}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                        {order.projectName}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                        <div className="flex -space-x-2">
                          {order.team.images.map((img, i) => (
                            <div
                              key={i}
                              className="w-6 h-6 overflow-hidden border-2 border-white rounded-full dark:border-gray-900"
                            >
                              <img src={img} alt={`Team ${i + 1}`} className="w-full size-6" />
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                        <Badge
                          color={
                            order.status === "Active"
                              ? "success"
                              : order.status === "Pending"
                              ? "warning"
                              : "error"
                          }
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                        {order.budget}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </ComponentCard>
    </HelmetProvider>
  );
}