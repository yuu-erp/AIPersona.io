# AIPersona.io - Business Strategy & Technical Requirements

## 1. Project Overview

**AIPersona.io** là nền tảng SaaS cung cấp giải pháp quản lý mạng xã hội tích hợp AI Influencer. Hệ thống được thiết kế để phục vụ từ người dùng phổ thông đến các Agencies chuyên nghiệp thông qua mô hình kinh doanh gói cước (Subscription).

## 2. Subscription Plans (Cấu hình gói cước)

| Tính năng            | Gói FREE                | Gói PRO               | Gói ULTRA              |
| :------------------- | :---------------------- | :-------------------- | :--------------------- |
| **Quản lý Social**   | Hỗ trợ (TikTok, FB, IG) | Hỗ trợ                | Hỗ trợ                 |
| **Xem Tương tác**    | Xem số liệu cơ bản      | Phân tích chuyên sâu  | Phân tích chuyên sâu   |
| **Tạo Persona**      | **Không hỗ trợ**        | Tối đa 01 Persona     | Không giới hạn         |
| **Tạo nội dung AI**  | **Không hỗ trợ**        | Hỗ trợ (Trend/Custom) | Hỗ trợ (Trend/Custom)  |
| **Giới hạn Render**  | N/A                     | 01 Video / ngày       | Không giới hạn (\*)    |
| **Ưu tiên hàng đợi** | N/A                     | Bình thường           | Ưu tiên cao (Priority) |

(*) *Áp dụng chính sách sử dụng hợp lý (Fair Usage Policy).\*

## 3. Core Business Workflows

### A. Onboarding & Monetization Flow

1. **Đăng ký:** User đăng ký qua Email (Xác thực link) hoặc Google OAuth2.
2. **Landing Page:** User tham khảo tính năng và chọn gói cước.
3. **Thanh toán:** Tích hợp Gateway (Stripe/PayOS). Sau khi thanh toán thành công, Webhook cập nhật `planType` trong Database.
4. **Phân quyền:** Hệ thống dùng `PlanGuard` để mở khóa tính năng tương ứng với gói đã mua.

### B. AI Content & Moderation Pipeline

Hệ thống cho phép User kiểm soát nội dung trước khi xuất bản:

1. **Render:** AI Worker thực hiện Face Swap và render video.
2. **Kiểm duyệt (Moderation Mode):**
   - **Nếu Bật:** Video render xong nằm ở trạng thái `PENDING_APPROVAL`. User nhận thông báo để vào kiểm tra và nhấn "Duyệt" hoặc "Từ chối".
   - **Nếu Tắt:** Video tự động chuyển sang `SCHEDULED` để đăng tải theo lịch.
3. **Giới hạn gói:** Nếu User gói PRO đã dùng hết 1 lượt/ngày, nút "Generate" sẽ bị vô hiệu hóa cho đến ngày hôm sau.

## 4. Technical Architecture (Modular Monolith)

- **Framework:** NestJS + Prisma v7.
- **Queue:** BullMQ + Redis (Quản lý lượt render và priority queue).
- **Billing:** Stripe/PayOS Integration với Webhook xử lý realtime.
- **Guards:** - `JwtAuthGuard`: Xác thực người dùng.
  - `PlanGuard`: Kiểm tra quyền hạn gói cước.
  - `UsageGuard`: Kiểm tra hạn mức sử dụng (Quota).

## 5. Database Extension Requirements

Bổ sung các trường quản lý kinh doanh vào `User` entity:

- `plan`: `FREE`, `PRO`, `ULTRA`.
- `planExpiresAt`: Ngày hết hạn gói.
- `dailyVideoCount`: Số video đã tạo trong ngày (Reset hàng ngày).
- `moderationEnabled`: Bật/tắt chế độ phê duyệt thủ công.

---

_Created at: 2026-02-24_
_Author: Hoàn - SaaS Provider_
