function Input({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  rightElement,
}) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <label
        style={{
          display: "block",
          textAlign: "left",
          fontWeight: "bold",
          marginBottom: "8px",
        }}
      >
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={{
            border: error ? "1px solid red" : "1px solid #ddd",
            borderRadius: "8px",
            padding: "12px",
            width: "100%",
            boxSizing: "border-box",
            fontSize: "14px",
          }}
        />
        {rightElement && (
          <div
            style={{
              position: "absolute",
              right: "12px",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            {rightElement}
          </div>
        )}
      </div>
      {error && <p style={{ color: "red", fontSize: "12px" }}>{error}</p>}
    </div>
  );
}

export default Input;
