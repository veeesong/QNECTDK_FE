import PageLayout from "../components/PageLayout";
import logo from "../assets/logo.png";

function Splash() {
  return (
    <PageLayout>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
        }}
      >
        <img src={logo} alt="Qnect 로고" width={200} />
      </div>
    </PageLayout>
  );
}

export default Splash;
