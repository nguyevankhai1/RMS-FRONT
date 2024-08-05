const SubSidebarConfig = {
  dashboard: {
    name: 'Dashboard',
  },
  giamsat: {
    name: 'Giám sát',
  },
  category: {
    name: 'Danh Mục',
    menu: [
      {
        name: 'Danh mục chung',
        urlName: 'danh-muc-danh-muc',
      },

      {
        name: 'Tỉnh thành',
        urlName: 'danh-muc-tinh-thanh-pho',
      },
      {
        name: 'Quận huyện',
        urlName: 'danh-muc-quan-huyen',
      },
      {
        name: 'Xã phường',
        urlName: 'danh-muc-xa-phuong',
      },
    ],
  },
  pcccUnit: {
    name: 'Đơn vị PCCC',
    menu: [
      {
        name: 'QL đơn vị PCCC',
        urlName: 'don-vi-quan-ly-don-vi-pccc',
      },
      {
        name: 'QL đội PCCC',
        urlName: 'don-vi-doi-pccc',
      },
      {
        name: 'QL cán bộ',
        urlName: 'don-vi-can-bo',
      },
      {
        name: 'QL Nguồn nước CC',
        urlName: 'don-vi-diem-lay-nuoc',
      },
      {
        name: 'QL Phương tiện',
        urlName: 'don-vi-phuong-tien',
      },
      {
        name: 'Sửa chữa, bảo dưỡng phương tiện PCCC',
        urlName: 'don-vi-bao-duong-phuong-tien',
      },
      {
        name: 'QL Đơn vị hỗ trợ',
        urlName: 'don-vi-don-vi-ho-tro',
      },
      {
        name: 'QL Lịch trực',
        urlName: 'don-vi-lich-truc',
      },
      {
        name: 'QL Đổi ca',
        urlName: 'don-vi-doi-ca',
      },
      {
        name: 'QL Giao ca',
        urlName: 'don-vi-giao-ca',
      },
    ],
  },
  fireProtection: {
    name: 'Công tác phòng Cháy',
    menu: [
      {
        name: 'QL chủ cơ sở công trình',
        urlName: 'phong-chay-chu-co-so-cong-trinh',
      },
      {
        name: 'QL cơ sở công trình',
        urlName: 'phong-chay-co-so-cong-trinh',
      },
      {
        name: 'CT thẩm duyệt - nghiệm thu',
        urlName: 'phong-chay-tham-duyet',
        actions: [
          {
            name: 'Thẩm duyệt',
            urlName: 'phong-chay-tham-duyet',
          },
          {
            name: 'Nghiệm thu',
            urlName: 'phong-chay-nghiem-thu',
          },
        ],
      },
      {
        name: 'CT tuyên truyền - huấn luyện',
        urlName: 'phong-chay-tuyen-truyen-huan-luyen',
      },
      {
        name: 'Phê duyệt - Thực tập PA PCCC',
        urlName: 'phong-chay-tham-duyet',
        actions: [
          {
            name: 'Phương án PCCC',
            urlName: 'phong-chay-phuong-an-pccc',
          },
          {
            name: 'Thực tập phương án PCCC',
            urlName: 'phong-chay-thuc-tap-phuong-an',
          },
        ],
      },
      {
        name: 'QL Kiểm tra AT PCCC',
        urlName: 'phong-chay-lap-ke-hoach-kiem-tra',
        actions: [
          {
            name: 'Lập kế hoạch kiểm tra',
            urlName: 'phong-chay-lap-ke-hoach-kiem-tra',
          },
          {
            name: 'Kết quả kiểm tra',
            urlName: 'phong-chay-thuc-hien-ket-qua-kiem-tra',
          },
        ],
      },
      {
        name: 'QL Xử lý vi phạm',
        urlName: 'phong-chay-xu-ly-vi-pham',
      },
      {
        name: 'QL Phục hồi hoạt động',
        urlName: 'phong-chay-phuc-hoi-hoat-dong-co-so',
      },
    ],
  },
  fireFighting: {
    name: 'CT Chữa Cháy & CNCH',
    menu: [
      {
        name: 'Công tác chữa cháy',
        urlName: 'chua-chay-cong-tac-chua-chay',
      },
      {
        name: 'Công tác CNCH',
        urlName: 'chua-chay-cuu-nan-cuu-ho',
      },
    ],
  },
  device: {
    name: 'QL Thiết bị',
    menu: [
      {
        name: 'QL thiết bị cảm biến',
        urlName: 'quan-ly-chung-cam-bien',
      },
      {
        name: 'QL thiết bị trung tâm',
        urlName: 'quan-ly-chung-thiet-bi-trung-tam',
      },
      {
        name: 'QL Camera',
        urlName: 'quan-ly-chung-thiet-bi-quay',
      },
    ],
  },
  report: {
    name: 'Báo Cáo',
    menu: [
      {
        name: 'Báo cáo Công tác chữa cháy',
        urlName: 'bao-cao-diem-chay',
      },
      {
        name: 'Báo cáo Cơ sở công trình',
        urlName: 'bao-cao-co-so-cong-trinh',
      },
      {
        name: 'Báo cáo kiểm tra AT PCCC',
        urlName: 'bao-cao-kiem-tra-an-toan-pccc',
        actions: [
          {
            name: 'BC Chi tiết kiểm tra AT PCCC',
            urlName: 'bao-cao-kiem-tra-an-toan-pccc',
          },
          {
            name: 'BC kiểm tra AT PCCC theo đơn vị hành chính',
            urlName: 'bao-cao-tong-hop-kq-an-toan-pccc',
          },
        ],
      },
      {
        name: 'Báo cáo Phương tiện',
        urlName: 'bao-cao-kiem-tra-an-toan-pccc',
        actions: [
          {
            name: 'BC chi tiết phương tiện PCCC',
            urlName: 'bao-cao-phuong-tien-pccc',
          },
          {
            name: 'BC thực trạng phương tiện PCCC',
            urlName: 'bao-cao-thuc-trang-phuong-tien-pccc',
          },
        ],
      },
      {
        name: 'Báo cáo Nguồn nước CC',
        urlName: 'bao-cao-tong-hop-nguon-nuoc',
      },
      {
        name: 'Báo cáo Thiết bị',
        urlName: 'bao-cao-thiet-bi-cam-bien',
        actions: [
          {
            name: 'Báo cáo Thiết bị cảm biến',
            urlName: 'bao-cao-thiet-bi-cam-bien',
          },
          {
            name: 'Báo cáo Thực trạng thiết bị',
            urlName: 'bao-cao-tong-hop-thiet-bi',
          },
        ],
      },
    ],
  },
}

export default SubSidebarConfig
