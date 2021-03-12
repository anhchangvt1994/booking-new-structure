interface LayoutHeaderInterface {
  title: string,
  keywords: string,
  desciption: string,
}; // LayoutHeaderInterface

interface LayoutBodyInterface {
  body_class_name: string,
}; // LayoutBodyInterface

interface DummyDataInfoInterface {
  id: string,
};

interface ResponseInterface {
  success: boolean,
  error: Object,
  data: Object,
}; // ResponseDataInterface
