function Button({
  label,
  onClick,
  variant = "primary",
  size = "full",
  disabled = false,
}) {
  const styles = {
    primary: { backgroundColor: "var(--color-primary)", color: "white" },
    secondary: { backgroundColor: "#EEEEEE", color: "#333" },
  };

  const sizes = {
    full: { width: "100%", padding: "14px" },
    small: { width: "auto", padding: "8px 16px" },
    half: { flex: 1, padding: "14px" },
  };

  return (
    <div
      onClick={disabled ? undefined : onClick}
      style={{
        ...styles[variant],
        ...sizes[size],
        borderRadius: "20px",
        fontSize: "16px",
        textAlign: "center",
        cursor: disabled ? "default" : "pointer",
        boxSizing: "border-box",
        display: "block",
        lineHeight: "1.5",
        fontWeight: "bold",
        opacity: disabled ? 0.6 : 1,
      }}
    >
      {label}
    </div>
  );
}

export default Button;
