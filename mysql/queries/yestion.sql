use yestion;

create table users( -- 유저 테이블
	id bigint auto_increment primary key, -- id :  bigint, 자동증가, 기본 키
    email varchar(255) not null unique, -- 이메일 : 255까지, 공백X , 중복불가 제약 조건
    name varchar(50) not null, -- 네임 : 50까지, 공백X
    password varchar(255) not null collate utf8_bin, -- 패스워드 : 255까지, 공백X, 암호화
    created_at datetime not null -- created_at : 날짜, 공백X
);

create table categories( -- 카테고리즈 테이블
	id bigint auto_increment primary key, -- id : bigint, 자동증가, 기본 키
    user_id bigint not null, -- 유저 id : bigint, 공백X
    name varchar(50) not null, -- 네임 : 50까지, 공백X
    color varbinary(7) not null, -- 색깔, 가변 길이 이진(바이너리) 데이터 형식
    foreign key(user_id) references users(id) --  users 테이블의 id를 참조하는 외래키
);

create table todos(
	id bigint auto_increment primary key, -- 할 일 고유 번호 (자동 증가 PK)
    user_id bigint not null, -- 작성자 아이디
    category_id bigint, -- 카테고리 아이디
    title varchar(255) not null, -- 할 일 제목
    memo TEXT NULL, -- 상세 메모
    due_date varchar(10) NUll, -- 마감 기한
    date varchar(10) not null, -- 할 일 수행 날짜
    done BOOLEAN not null default false, -- 완료 여부
    created_at datetime not null, -- 생성 일시
    foreign key(user_id) references users(id), -- 회원 테이블 연동을 위한 외래키
    foreign key(category_id) references categories(id) -- 카테고리 테이블 연동을 위한 외래키
);




