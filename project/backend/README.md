# English Quest backend

Backend cục bộ dùng FastAPI và SQLite. Database mặc định là `backend/data/english_quest.db`; có thể đổi bằng `ENGLISH_QUEST_DB_PATH`.

```powershell
python -m pip install -r backend\requirements.txt
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000
```

Không bind `0.0.0.0`. CORS chỉ cho phép frontend tại `localhost`/`127.0.0.1`, cổng `5173` và `4173`.

## Tài khoản

Username gồm 6-64 ký tự chữ, số, `_`, `-`; password phải đúng 4-6 chữ số. Password dùng PBKDF2-HMAC-SHA256 với salt riêng; session token chỉ lưu SHA-256 trong SQLite.

- `POST /auth/register` body `{"username":"player_01","password":"1234"}` → `201 {"user": {"id", "username", "created_at"}}`.
- `POST /auth/login` cùng body → `200 {"token":"...", "user": {...}}`.
- `GET /auth/me`, header `Authorization: Bearer <token>` → user phẳng `{id, username, created_at}`.
- `POST /auth/logout`, Bearer token → `204`; token hết hiệu lực.

Frontend đăng ký xong gọi `/auth/login` để nhận token.

## Điểm, tiến độ và streak

- `PUT /progress/{unit_id}/{activity_id}`, Bearer token, body:
  `{"earned_score":750,"max_score":1000,"completed":true}`.
- `GET /units/{unit_id}/summary`, Bearer token →
  `{unit_id, earned_score, max_score, completion_percent, current_streak, best_streak, progress}`.

`unit3` có manifest 42 hoạt động được chấm điểm: 7 game Getting Started/Practice; 5 game ở A Closer Look 1; và 5 game ở mỗi phần A Closer Look 2, Communication, Skills 1, Skills 2, Looking Back, Project. Mỗi game tối đa 1000 điểm, riêng Birthday Personality có 15 câu nên tối đa 1500; mẫu số Unit là 42500 kể cả khi game chưa chơi. `Listen and Read` không nằm trong mẫu số. Sound Sort và Rhythm Echo chỉ ghi hoàn thành và 1000 điểm sau ít nhất 60 giây chủ động; không chấm chất lượng phát âm. Mỗi lần lưu kết quả ghi nhận ngày học theo ngày cục bộ của máy; current streak chấp nhận chuỗi kết thúc hôm nay hoặc hôm qua. Khi chơi lại, điểm cao nhất theo từng vị trí câu được giữ và tổng game được tính lại.

`review1` là manifest độc lập gồm 6 game × 1000 điểm, mẫu số 6000; không cộng vào Unit 3. Review Bonus dùng cùng ba stage và cơ chế thưởng nhưng mở sau khi hoàn thành đủ 6 game, không có cổng luyện phát âm.

`review2` nằm sau Unit 6 và là manifest độc lập gồm 6 game × 1000 điểm, mẫu số 6000. Review 2 Bonus mở sau đủ 6 game, không có cổng luyện phát âm và điểm không cộng vào Unit 6.

`unit1` đã mở đủ 42 game × 1000 điểm, mẫu số 42000 và điểm tách riêng. Bonus chỉ mở khi đủ toàn bộ 42 game và đạt ngưỡng điểm. `unit1-acl1-sound` và `unit1-acl1-rhythm` yêu cầu ít nhất 60 giây chủ động, không chấm chất lượng phát âm.

`unit2` đã mở đủ 42 game × 1000 điểm, mẫu số 42000 và điểm tách riêng. Bonus chỉ mở khi đủ toàn bộ 42 game và đạt ngưỡng điểm. `unit2-acl1-sound` và `unit2-acl1-rhythm` yêu cầu ít nhất 60 giây chủ động, không chấm chất lượng phát âm.

`unit4` có đủ 42 game × 1000 điểm, mẫu số 42000 và điểm tách riêng Unit 3/Review 1. Bonus chỉ mở khi đủ toàn bộ 42 game và đạt ngưỡng điểm. Hai hoạt động `unit4-acl1-sound` và `unit4-acl1-rhythm` chỉ được xác nhận sau ít nhất 60 giây chủ động và nhận 1000 điểm, không chấm chất lượng phát âm.

`unit5` có đủ 42 game × 1000 điểm, mẫu số 42000 và điểm tách riêng. Bonus chỉ mở khi đủ toàn bộ 42 game và đạt ngưỡng điểm. `unit5-acl1-sound` và `unit5-acl1-rhythm` yêu cầu ít nhất 60 giây chủ động, không chấm chất lượng phát âm.

`unit6` đã mở đủ 42 game × 1000 điểm, mẫu số 42000 và điểm tách riêng. Bonus chỉ mở khi đủ toàn bộ 42 game và đạt ngưỡng điểm. `unit6-acl1-sound` và `unit6-acl1-rhythm` yêu cầu ít nhất 60 giây chủ động, không chấm chất lượng phát âm.

Bonus Quest không nằm trong manifest 42500. Ba màn Bonus lưu tier đã khóa và phần thưởng riêng; backend bốc thưởng 50/35/15, chặn nhận hai lần, buộc chơi đúng thứ tự và giảm một nửa phần thưởng nếu điểm màn dưới 700/1000. Đúng 90% mở kho cao; từ 70% đến dưới 90% có thể xác nhận kho tiêu chuẩn. Điểm từng câu của game chính được lưu theo thành tích tốt nhất để tạo danh sách luyện lại.

`GET /profile/scores` trả hồ sơ thành tích tốt nhất toàn khóa, điểm tốt nhất theo từng Unit/Review, tổng thưởng Bonus và tối đa 100 mốc cải thiện gần nhất. Bảng `best_score_history` chỉ thêm bản ghi khi điểm tốt nhất của một hoạt động tăng; migration tự tạo mốc ban đầu cho tiến độ cũ đang có.

Schema mới được tạo bằng `CREATE TABLE IF NOT EXISTS`; bảng `progress` cũ và API repository cũ vẫn được giữ để không mất dữ liệu local hiện có.

## Kiểm thử

```powershell
backend\.venv\Scripts\python.exe -m unittest discover -s backend\tests -v
```

Test bao phủ migration dữ liệu cũ, hash mật khẩu/token, đăng nhập/xuất phiên, validation strict, upsert tiến độ, mẫu số Unit, persistence và streak. Route/CORS được kiểm tra trực tiếp; HTTP TestClient chưa dùng vì runtime hiện tại yêu cầu thêm `httpx2` ngoài dependency tối thiểu.
