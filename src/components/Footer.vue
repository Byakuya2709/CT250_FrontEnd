<template>
     <footer id="footer " class="border-top">
        <div class="container p-3">
            <div class="row">
                <div class="col">
                    <h3>Hệ Thống Cửa Hàng</h3>
                    <div class="location">
                        <ul class="location-list">
                            <li class="location-item">
                                <p class="d-inline-flex gap-1">
                                    <button type="button" data-bs-toggle="collapse"
                                        data-bs-target="#collapseLocation-info-1" aria-expanded="false"
                                        aria-controls="collapseExample">
                                        <h4><i class="fa-solid fa-location-dot"></i>Chi Nhánh Hồ Chí Minh<i
                                                class=" ms-2 fa-solid fa-angle-down"></i></h4>
                                    </button>
                                </p>
                                <div class="collapse" id="collapseLocation-info-1">
                                    <div class="location-info">
                                        <p><strong>Quận 1</strong> - Central Market 4 Phạm Ngũ Lão, Phường Phạm Ngũ Lão.
                                        </p>
                                        <p> <strong>Quận 10</strong> - 561 Sư Vạn Hạnh, Phường 13.</p>
                                        <p><strong>Quận Gò Vấp</strong> - 326 Quang Trung, Phường 10.</p>
                                    </div>
                                </div>

                            </li>
                            <li class="location-item">
                                <p class="d-inline-flex gap-1">
                                    <button type="button" data-bs-toggle="collapse"
                                        data-bs-target="#collapseLocation-info-2" aria-expanded="false"
                                        aria-controls="collapseExample">
                                        <h4><i class="fa-solid fa-location-dot"></i>Chi Nhánh Cần Thơ<i
                                                class=" ms-2 fa-solid fa-angle-down"></i></h4>
                                    </button>
                                </p>
                                <div class="collapse" id="collapseLocation-info-2">
                                    <div class="location-info">
                                        <p><strong>Quận Ninh Kiều</strong> - 52 Mậu Thân, Phường An Phú.</p>
                                    </div>
                                </div>
                            </li>
                        </ul>
                        <div id="contact">
                            <p class="mb-0"><i class="fa-solid fa-envelope me-2"></i>nhom5@student.ctu.edu.vn</p>
                            <p class="mb-0"><i class="fa-solid fa-phone me-2"></i> Hỗ trợ / Mua hàng: 0xxx xxx xxx</p>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="social">
                        <h3>Mạng Xã Hội</h3>
                        <a href="" class="social-link">
                            <i class="social-icon fa-brands fa-facebook"></i>
                        </a>
                        <a href="" class="social-link">
                            <i class="social-icon fa-brands fa-instagram"></i>
                        </a>
                        <a href="" class="social-link">
                            <i class="social-icon fa-brands fa-youtube"></i>
                        </a>
                    </div>
                    <div class="policy">
                        <p class="d-inline-flex gap-1">
                            <button type="button" data-bs-toggle="collapse" data-bs-target="#collapsePolicy"
                                aria-expanded="false" aria-controls="collapseExample">
                                <h3>Chính Sách<i class=" ms-2 fa-solid fa-angle-down"></i></h3>
                            </button>
                        </p>
                        <div class="collapse" id="collapsePolicy">
                            <ul class="policy-list" style="list-style-type: decimal; margin-left: -1rem;">
                                <li class="policy-item"><a href="">Chính sách bảo mật</a></li>
                                <li class="policy-item"><a href="">FAQ</a></li>
                                <li class="policy-item"><a href="">Chính sách Bảo hành & Đổi trả</a></li>
                                <li class="policy-item"><a href="">Chính sách giao hàng</a></li>
                            </ul>

                        </div>

                    </div>
                </div>

            </div>
        </div>
        <div class=" text-center pt-2 border-top">
            <p>Copyright &copy; nhom 5.</p>
        </div>
    </footer>
</template>
<script>
export default {
   name: "Footer"
};
</script>