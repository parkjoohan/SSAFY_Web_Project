window.addEventListener("load", () => {
  displayMap();
  getData(
    "https://api.odcloud.kr/api/15067698/v1/uddi:45692c78-d40e-4156-93d6-81c186620dd5",
    makeCity
  );
  getData(
    "https://api.odcloud.kr/api/15067699/v1/uddi:0c8ed5b5-30ff-4495-9b0d-d89f94d7308f",
    makeGu
  );

  getData(
    "https://api.odcloud.kr/api/15067695/v1/uddi:d18ea49c-c61d-458f-86f9-d53ed4c9dc12",
    makeDong
  );

  setCity();
});
