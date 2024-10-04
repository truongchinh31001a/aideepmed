

export async function getStaticProps({ locale }) {
    return {
      props: {
        locale,
        messages: await import(`../locales/${locale}/translation.json`), // Đảm bảo rằng bạn có tệp json tương ứng với locale
      },
    };
  }
  
