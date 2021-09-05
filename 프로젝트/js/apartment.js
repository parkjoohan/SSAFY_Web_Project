const getDeal = (city, gu, dong) => {
  const ServiceKey =
    "uPAn7xSGN4w2m7/qZh9YOkb4WR5DzZHvZU6Zdjgm215+uzFA+Xfhnbw/zgeY1/anWuFaSyU+Lcrbgt0QuMqhJQ==";
  const LAWD_CD = gu;
  const DEAL_YMD = "202001";
  var pageNo = "1";
  var numOfRows = "1000";
  // server에서 넘어온 data
  $(".media").empty();
  $.ajax({
    url: "http://openapi.molit.go.kr/OpenAPI_ToolInstallPackage/service/rest/RTMSOBJSvc/getRTMSDataSvcAptTradeDev",
    type: "GET",
    dataType: "xml",

    data: {
      ServiceKey,
      LAWD_CD,
      DEAL_YMD,
      pageNo,
      numOfRows,
    },
    success: function (response) {
      makeList(response, city, gu, dong);
    },
    error: function (xhr, status, msg) {
      console.log("상태값 : " + status + " Http에러메시지 : " + msg);
    },
  });
};

window.addEventListener("load", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const city = urlParams.get("city");
  const gu = urlParams.get("gu");
  const dong = urlParams.get("dong");

  await getData(
    "https://api.odcloud.kr/api/15067698/v1/uddi:45692c78-d40e-4156-93d6-81c186620dd5",
    makeCity
  );
  await getData(
    "https://api.odcloud.kr/api/15067699/v1/uddi:0c8ed5b5-30ff-4495-9b0d-d89f94d7308f",
    makeGu
  );

  await getData(
    "https://api.odcloud.kr/api/15067695/v1/uddi:d18ea49c-c61d-458f-86f9-d53ed4c9dc12",
    makeDong
  );

  displayMap();
  setCity();
  $("#city").val(city);
  setGu();
  $("#gu").val(gu);
  setDong();
  $("#dong").val(dong);
  getDeal(city, gu, dong);
});

function makeList(data, city, gu, dong) {
  let aptlist = ``;
  const bounds = new kakao.maps.LatLngBounds();

  let apt = {};
  $(data)
    .find("item")
    .each(async function () {
      if ($(this).find("법정동").text().trim() === dong) {
        const aptName = $(this).find("아파트").text();
        const aptData = {
          price: $(this).find("거래금액").text(),
          area: $(this).find("전용면적").text(),
          date:
            $(this).find("년").text() +
            "." +
            $(this).find("월").text() +
            "." +
            $(this).find("일").text(),
          address:
            region[city].name +
            " " +
            region[city].gu[gu].name +
            " " +
            $(this).find("도로명").text() +
            " " +
            parseInt($(this).find("도로명건물본번호코드").text(), 10),
        };

        if (aptName in apt) {
          apt[aptName].push(aptData);
        } else {
          apt[aptName] = [aptData];
        }
      }
    });

  for (let aptName in apt) {
    aptlist += `<div>
          <h3 class="widget-title">${aptName}</h3>
          <h4 class="media-heading">거래금액: ${apt[aptName][0].price}원</h4>
          <h4 class="media-heading">면적: ${apt[aptName][0].area}</h4>
          <p class="small margin-clear">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path fill-rule="evenodd" d="M4.75 0a.75.75 0 01.75.75V2h5V.75a.75.75 0 011.5 0V2h1.25c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0113.25 16H2.75A1.75 1.75 0 011 14.25V3.75C1 2.784 1.784 2 2.75 2H4V.75A.75.75 0 014.75 0zm0 3.5h8.5a.25.25 0 01.25.25V6h-11V3.75a.25.25 0 01.25-.25h2zm-2.25 4v6.75c0 .138.112.25.25.25h10.5a.25.25 0 00.25-.25V7.5h-11z"></path></svg>
          ${apt[aptName][0].date}</p>
          <hr />
          </div>`;
    const geocoder = new kakao.maps.services.Geocoder();
    geocoder.addressSearch(apt[aptName][0].address, (result, status) => {
      // 정상적으로 검색이 완료됐으면
      if (status === kakao.maps.services.Status.OK) {
        const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
        // 결과값으로 받은 위치를 마커로 표시합니다
        // 마커를 생성합니다
        const marker = new kakao.maps.Marker({
          map: map,
          position: coords,
        });

        // 인포윈도우로 장소에 대한 설명을 표시합니다
        const costWindow = new kakao.maps.InfoWindow({
          content: `<div style="width:150px;text-align:center;padding:6px 0;">${apt[aptName][0].price}</div>`,
        });
        costWindow.open(map, marker);

        const iwContent = `<div style="width:150px;text-align:center;padding:6px 0;">${aptName}</div>`; // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다

        // 인포윈도우를 생성합니다
        const infowindow = new kakao.maps.InfoWindow({
          content: iwContent,
        });

        // 마커에 마우스오버 이벤트를 등록합니다
        kakao.maps.event.addListener(marker, "mouseover", function () {
          // 마커에 마우스오버 이벤트가 발생하면 인포윈도우를 마커위에 표시합니다
          infowindow.open(map, marker);
        });

        // 마커에 마우스아웃 이벤트를 등록합니다
        kakao.maps.event.addListener(marker, "mouseout", function () {
          // 마커에 마우스아웃 이벤트가 발생하면 인포윈도우를 제거합니다
          infowindow.close();
        });

        kakao.maps.event.addListener(marker, "click", function (e) {
          const aptName = infowindow.a.innerText;
          let aptlist = `<h3 class="widget-title">${aptName}</h3>`;
          apt[aptName].map((a) => {
            aptlist += `<div>
                  <h4 class="media-heading">거래금액: ${a.price}원</h4>
                  <h4 class="media-heading">면적: ${a.area}</h4>
                  <p class="small margin-clear">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path fill-rule="evenodd" d="M4.75 0a.75.75 0 01.75.75V2h5V.75a.75.75 0 011.5 0V2h1.25c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0113.25 16H2.75A1.75 1.75 0 011 14.25V3.75C1 2.784 1.784 2 2.75 2H4V.75A.75.75 0 014.75 0zm0 3.5h8.5a.25.25 0 01.25.25V6h-11V3.75a.25.25 0 01.25-.25h2zm-2.25 4v6.75c0 .138.112.25.25.25h10.5a.25.25 0 00.25-.25V7.5h-11z"></path></svg>
                  ${a.date}</p>
                  <hr />
                  </div>`;
            map.setCenter(coords);
            map.setLevel(2);
          });

          $(".widget").empty().append(aptlist);
        });
        // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
        bounds.extend(coords);
        map.setBounds(bounds);
      }
    });
  }

  $(".widget").append(aptlist);
}
