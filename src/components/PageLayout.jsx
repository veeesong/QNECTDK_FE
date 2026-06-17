function PageLayout({ children }) {
  return (
    <div
      style={{
        padding: "24px",
        boxSizing: "border-box",
        flex: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {children}
    </div>
  );
}

export default PageLayout;
