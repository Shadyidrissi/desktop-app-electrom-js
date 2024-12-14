export default function ForbiddenPage() {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>403 - لا تملك صلاحيات للوصول</h1>
        <p>عذرًا، هذه الصفحة مخصصة للمسؤولين فقط.</p>
        <a href="/" style={{ color: "blue", textDecoration: "underline" }}>
          العودة إلى الصفحة الرئيسية
        </a>
      </div>
    );
  }
  