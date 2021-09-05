let region = {};
// 초기 kakao map 설정 start
let map, marker;

const displayMap = () => {
  const container = document.getElementById("map"); //지도를 담을 영역의 DOM 레퍼런스
  const locPosition = new kakao.maps.LatLng(37.5012743, 127.039585); // (멀티캠퍼스)
  const options = {
    //지도를 생성할 때 필요한 기본 옵션
    center: locPosition, //지도의 중심좌표.
    level: 3, //지도의 레벨(확대, 축소 정도)
  };

  map = new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴
  map.setCenter(locPosition);
};

const getData = async (url, func) => {
  const ServiceKey =
    "uPAn7xSGN4w2m7%2FqZh9YOkb4WR5DzZHvZU6Zdjgm215%2BuzFA%2BXfhnbw%2FzgeY1%2FanWuFaSyU%2BLcrbgt0QuMqhJQ%3D%3D";
  let pageNo = 1;
  let numOfRows = 5000;
  let totalCount = 0;
  while (true) {
    await $.ajax({
      url:
        url + `?page=${pageNo}&perPage=${numOfRows}&serviceKey=${ServiceKey}`,
      type: "GET",
      async: false,
      success: (response) => {
        func(response.data);
        totalCount = response.totalCount;
      },
      error: function (xhr, status, msg) {
        console.log("상태값 : " + status + " Http에러메시지 : " + msg);
      },
    });
    if (totalCount <= pageNo * numOfRows) {
      break;
    }
    pageNo++;
  }
};

const makeCity = (city) => {
  $(city).each(function () {
    region[this["시도코드"]] = {
      name: this["시도명"].trim(),
      gu: {},
    };
  });
};

const makeGu = (gu) => {
  $(gu).each(function () {
    if (region[this["시도코드"]]) {
      region[this["시도코드"]].gu[this["시군구코드"]] = {
        name: this["시군구명"].trim(),
        dong: [],
      };
    }
  });
};

const makeDong = (dong) => {
  $(dong).each(function () {
    let sidoCode = this["시군구코드"].substring(0, 2);
    if (region[sidoCode] && region[sidoCode].gu[this["시군구코드"]]) {
      region[sidoCode].gu[this["시군구코드"]].dong.push(
        this["읍면동명"].trim()
      );
    }
  });
};

const setCity = () => {
  for (let sidoCode in region) {
    $("#city").append(`
      <option class="bg-white dropdown-item" value=${sidoCode}>
        ${region[sidoCode].name}
      </option>
      `);
  }

  $("#city").change(setGu);
  $("#gu").change(setDong);
  $("#dong").change(() => {
    // console.log($("#mapForm"));
    $("#mapForm").submit();
  });
};

const setGu = () => {
  const city = $("#city").val();
  $("#gu").empty();
  $("#gu").append(`
    <option class="bg-white dropdown-item" value="시/군/구" selected>
      시/군/구
    </option>
  `);

  for (let sggCode in region[city].gu) {
    $("#gu").append(`
      <option class="bg-white dropdown-item" value=${sggCode}>
        ${region[city].gu[sggCode].name}
      </option>
      `);
  }
};

const setDong = () => {
  const city = $("#city").val();
  const gu = $("#gu").val();
  $("#dong").empty();
  $("#dong").append(`
    <option class="bg-white dropdown-item" value="읍/면/동" selected>
    읍/면/동
    </option>
  `);

  for (let dong of region[city].gu[gu].dong) {
    $("#dong").append(`
      <option class="bg-white dropdown-item" value=${dong}>
        ${dong}
      </option>
      `);
  }
};
