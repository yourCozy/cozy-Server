module.exports = {
    NULL_VALUE: '필요한 값이 없습니다',
    OUT_OF_VALUE: '파라미터 값이 잘못되었습니다',
    REQUIRE_LOGIN: '로그인이 필요한 api입니다.',

    // 회원가입
    CREATED_USER: '회원 가입 성공',
    DELETE_USER: '회원 탈퇴 성공',
    CREATED_AND_LOGIN: '회원 가입 후 로그인 성공',
    ALREADY_ID: '이미 사용중인 아이디입니다.',
    ALREADY_EMAIL: '이미 등록된 이메일입니다.',
    AVAILABLE_EMAIL: '가입 가능한 이메일입니다.',
    ALREADY_NICKNAME: '이미 사용중인 닉네임입니다.',
    AVAILABLE_NICKNAME: '사용 가능한 닉네임입니다.',
    
    // 로그인
    LOGIN_SUCCESS: '로그인 성공',
    LOGIN_FAIL: '로그인 실패',
    NO_USER: '존재하지 않는 회원입니다.',
    MISS_MATCH_PW: '비밀번호가 맞지 않습니다.',

    // 인증
    EMPTY_TOKEN: '토큰 값이 없습니다.',
    EXPIRED_TOKEN: '토큰 값이 만료되었습니다.',
    INVALID_TOKEN: '유효하지 않은 토큰값입니다.',
    AUTH_SUCCESS: '인증에 성공했습니다.',
    ISSUE_SUCCESS: '새로운 토큰이 생성되었습니다.',
    
    // 프로필 조회
    READ_PROFILE_SUCCESS: '프로필 조회 성공',
    READ_PROFILE_FAIL: '정보가 없습니다.',
    UNSUPPORTED_TYPE: '지원하지 않는 타입입니다.',
    // 이미지 업데이트
    UPDATE_IMAGE_SUCCESS: '이미지 업데이트 성공',
    // 프로필 업데이트
    UPDATE_PROFILE_SUCCESS: '프로필 업데이트 성공',

    // 북마크 관련
    BOOKMARK_SUCCESS: '북마크 체크/해제 성공',

    // 서점 데이터 관련
    NO_DATA: '서점 리스트가 없습니다.',
    READ_DATA_SUCCESS: '서점 리스트 조회 성공',
    GET_BOOKSTORE_SUCCESS: '서점 조회 성공',
    GET_BOOKSTORE_FAIL: '서점 조회 실패',

    // 활동 데이터 관련
    NO_ACT_DATA: '활동 리스트가 없습니다.',
    READ_ACT_DATA_SUCCESS: '활동 리스트 조회 성공',

    // 취향 관련
    REGISTER_TASTES_SUCCESS: '취향 등록 성공',
    REGISTER_TASTES_FAIL: '취향 등록 실패',
    UPDATE_TASTES_SUCCESS: '취향 수정 성공',
    UPDATE_TASTES_FAIL: '취향 수정 실패',

    // cookie 관련
    COOKIE_SUCCESS: '쿠키가 저장되었습니다.',
    COOKIE_FAIL: '쿠키 저장에 실패했습니다.',

    // 최근 본 책방
    NO_RECENT_BOOKSTORES: '최근 본 책방이 없습니다.',
    RECENT_BOOKSTORES: '최근 본 책방 조회 성공',

    //이메일 관련
    SEND_EMAIL_SUCCESS: '이메일 발송 성공',
    
    //비밀번호 확인 관련
    DIFFERENT_PW: '비밀번호가 다릅니다.',

    // 검색 관련
    NO_SEARCH_DATA: '검색 내역이 없습니다.',
    NO_KEYWORD: '검색어를 입력하세요.',
    SUCCESS_SEARCH: '검색 성공',

    //후기 관련
    INSERT_REVIEW_SUCCESS: '후기가 작성되었습니다.',
    ERROR_IN_INSERT_REVIEW: '후기 작성이 실패하였습니다.',
    NO_REVIEW: '작성된 후기가 없습니다.',
    SELECT_REVIEW: '후기 조회 성공',
    DELETE_REVIEW: '후기 삭제 성공',
    ERROR_IN_DELETE_REVIEW: '후기 삭제 실패',
    UPDATE_REVIEW: '후기 수정 성공',
    ERROR_IN_UPDATE_REVIEW: '후기 수정 실패',
    SUCCESS_UPDATE_REVIEW_PHOTO: '후기 사진 업데이트 성공',
    NO_PHOTO: '업데이트할 후기 사진이 없습니다.', 
    REVIEW_UPDATING: '후기 수정 중...',

    // 취향 관련
    ALREADY_USER: '이미 등록된 사용자입니다.',

    //지역 관련
    SUCCESS_SECTION : '지역별 서점 갯수 count 성공',
    
    //소셜 로그인 관련
    EMAIL_NICKNAME_MATCH_ERR : '해당 이메일로 회원가입이 되어있습니다.',
    DELETE_SESSION: '세션을 삭제했습니다.(로그아웃 되었습니다.)',

    //내 정보페이지
    SHOW_MYINFO_SUCCESS : '정보 페이지 조회 성공',
    SHOW_MYINFO_FAIL : '정보 페이지 조회 실패',
    
    GET_REFRESH_TOKEN : 'userIdx에 해당하는 refreshToken입니다.',
    DB_ERROR: 'DB 오류'

};