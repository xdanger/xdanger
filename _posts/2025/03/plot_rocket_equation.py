#!/usr/bin/env python3
"""
火箭方程可视化工具 - 绘制火箭质量比相关图表
"""

import os

import matplotlib as mpl
import matplotlib.pyplot as plt
import numpy as np


# 设置中文字体支持
def setup_fonts():
    """配置字体使其支持中文显示"""
    plt.rcParams["font.sans-serif"] = [
        "LXGW Bright",
        "SimHei",
        "Arial Unicode MS",
        "Zed Sans",
        "DejaVu Sans",
    ]
    plt.rcParams["axes.unicode_minus"] = False
    mpl.rcParams["figure.figsize"] = (10, 6)
    # 设置默认的灰色区域样式
    mpl.rcParams["hatch.color"] = "gray"
    mpl.rcParams["hatch.linewidth"] = 0.5


# 物理常量
G = 6.6743e-11  # 万有引力常数，m^3/(kg*s^2)
M = 5.9722e24  # 地球质量，kg
R = 6371e3  # 地球半径，m
h = 400e3  # 轨道高度，m (400 km)


# 计算入轨所需速度增量
def calculate_orbital_delta_v(
    G=G,
    m=M,
    r=R,
    orbit_height=h,
    gravity_loss=1.5,
    atmospheric_loss=0.3,
    rotation_benefit=0.46,
    launch_latitude=0,
):
    """计算进入特定高度轨道所需的速度增量

    参数：
        G: 万有引力常数，默认为 6.6743e-11 m^3/(kg*s^2)
        m: 天体质量，默认为地球质量
        r: 天体半径，默认为地球半径
        orbit_height: 轨道高度，默认为 400km
        gravity_loss: 重力损失 (km/s)，默认为 1.5 km/s
        atmospheric_loss: 大气阻力损失 (km/s)，默认为 0.3 km/s
        rotation_benefit: 地球自转速度在赤道处的贡献 (km/s)，默认为 0.46 km/s
        launch_latitude: (度)，发射地点的纬度，用于计算自转速度贡献

    返回：
        速度增量 (m/s)
    """
    # 计算基本轨道速度
    orbital_velocity = np.sqrt(G * m / (r + orbit_height))

    # 将损失单位从 km/s 转换为 m/s
    gravity_loss_ms = gravity_loss * 1000
    atmospheric_loss_ms = atmospheric_loss * 1000
    rotation_benefit_ms = rotation_benefit * 1000 * np.cos(np.radians(launch_latitude))

    # 计算总速度增量 = 轨道速度 + 重力损失 + 大气损失 - 自转收益
    total_delta_v = (
        orbital_velocity + gravity_loss_ms + atmospheric_loss_ms - rotation_benefit_ms
    )

    return total_delta_v


# 计算质量比
def calculate_mass_ratio(delta_v, exhaust_velocity):
    """根据火箭方程计算质量比"""
    return np.exp(delta_v / exhaust_velocity)


# 配置输出路径
def setup_output_dir():
    """配置并创建输出目录"""
    root_dir = os.path.abspath(
        os.path.join(os.path.dirname(__file__), "..", "..", "..")
    )
    output_dir = os.path.join(root_dir, "public", "images", "2025", "03")
    os.makedirs(output_dir, exist_ok=True)
    return output_dir


# 设置图表样式
def setup_plot_style(style="seaborn-v0_8-whitegrid"):
    """设置图表整体样式"""
    plt.style.use(style)
    setup_fonts()


# 图表 1: 火箭质量比与排气速度关系
def plot_mass_ratio_vs_exhaust_velocity(delta_v):
    """绘制火箭质量比与排气速度关系图"""
    plt.figure(figsize=(10, 6))

    # 生成排气速度数据点 (2-5 km/s)
    v_e_values = np.linspace(2000, 5000, 1000)
    mass_ratios = [calculate_mass_ratio(delta_v, v_e) for v_e in v_e_values]

    # 绘制主曲线
    plt.plot(v_e_values / 1000, mass_ratios, "b-", linewidth=2)
    plt.grid(True, linestyle="--", alpha=0.7)
    plt.xlabel("排气速度 $v_e$ (km/s)", fontsize=12)
    plt.ylabel("质量比 $r_m = m_0/m_f$", fontsize=12)
    plt.title("火箭质量比与排气速度的关系", fontsize=14)

    # 标注典型化学火箭点
    typical_v_e = 3500  # 典型化学火箭排气速度，m/s
    typical_ratio = calculate_mass_ratio(delta_v, typical_v_e)
    plt.plot([typical_v_e / 1000], [typical_ratio], "ro")

    annotation_text = f"对于典型化学火箭 ($v_e$ ≈ {typical_v_e / 1000:.1f} km/s)\n质量比 ≈ {typical_ratio:.1f}"
    plt.annotate(
        annotation_text,
        xy=(typical_v_e / 1000, typical_ratio),
        xytext=(typical_v_e / 1000 - 0.7, typical_ratio + 5),
        arrowprops=dict(facecolor="black", shrink=0.05, width=1.5),
        fontsize=10,
    )

    # 添加可实现质量比上限线
    achievable_ratio = 20
    plt.axhline(y=achievable_ratio, color="r", linestyle="--", alpha=0.7)
    plt.text(4.5, achievable_ratio + 2, "可实现的典型质量比上限", fontsize=10)

    # 设置 X 轴和 Y 轴的限制 - 使用线性坐标轴
    plt.xlim(1.9, 5.1)  # 确保有足够的左右边距
    plt.ylim(0, 45)  # 线性坐标轴下的 Y 轴范围

    # 添加灰色斜线填充不可能区域 - 使用更密的点阵
    x_fill = np.linspace(1.9, 5.1, 100)  # 使用更宽的范围

    # 绘制不可行区域
    plt.fill_between(
        x_fill,
        achievable_ratio,
        45,
        facecolor="lightgray",
        hatch="//////",
        alpha=0.5,
        edgecolor="gray",
        label="技术上难以实现区域",
    )

    # 添加公式说明
    formula = (
        r"$r_m = e^{\frac{\Delta v}{v_e}} = e^{\frac{\sqrt{\frac{GM}{R+h}}}{v_e}}$"
    )
    plt.text(2.1, 38, formula, fontsize=14, bbox=dict(facecolor="white", alpha=0.8))

    # 添加物理常数信息
    constants_text = f"其中:\nG = {G:.2e} m³/(kg·s²)\nM = {M:.2e} kg\nR = {R / 1000:.0f} km\nh = {h / 1000:.0f} km\nΔv = {delta_v / 1000:.2f} km/s"
    plt.text(
        2.1, 28, constants_text, fontsize=9, bbox=dict(facecolor="white", alpha=0.8)
    )

    # 添加图例
    plt.legend(loc="upper right")

    return plt.gcf()


# 图表 2: 火箭质量比与重力因子关系
def plot_mass_ratio_vs_gravity_factor(delta_v, exhaust_velocity=3500):
    """绘制火箭质量比与重力因子关系图"""
    plt.figure(figsize=(10, 6))

    # 生成重力因子数据点 (0.5-1.5 倍地球重力)
    g_factors = np.linspace(0.5, 1.5, 1000)

    # 计算每个重力因子下的质量比
    def mass_ratio_with_g_factor(g_factor):
        """根据重力因子计算质量比"""
        modified_delta_v = delta_v * np.sqrt(g_factor)
        return calculate_mass_ratio(modified_delta_v, exhaust_velocity)

    mass_ratios_g = [mass_ratio_with_g_factor(g) for g in g_factors]

    # 绘制主曲线
    plt.plot(g_factors, mass_ratios_g, "g-", linewidth=2)
    plt.grid(True, linestyle="--", alpha=0.7)
    plt.xlabel("重力因子 $f$ (相比地球标准重力)", fontsize=12)
    plt.ylabel("质量比 $r_m = m_0/m_f$", fontsize=12)
    plt.title("火箭质量比与重力因子的关系", fontsize=14)

    # 标注地球标准重力点
    earth_ratio = mass_ratio_with_g_factor(1)
    plt.plot([1], [earth_ratio], "ro")

    earth_annotation = f"地球标准重力\n质量比 ≈ {earth_ratio:.1f}"
    plt.annotate(
        earth_annotation,
        xy=(1, earth_ratio),
        xytext=(1.05, earth_ratio + 2),
        arrowprops=dict(facecolor="black", shrink=0.05, width=1.5),
        fontsize=10,
    )

    # 添加可实现质量比上限线
    achievable_ratio = 20
    plt.axhline(y=achievable_ratio, color="r", linestyle="--", alpha=0.7)
    plt.text(1.25, achievable_ratio + 2, "可实现的典型质量比上限", fontsize=10)

    # 添加临界重力因子线
    critical_g = 1.21
    plt.axvline(x=critical_g, color="r", linestyle="-.", alpha=0.7)
    plt.text(critical_g + 0.02, 35, "重力限制点\n火箭无法入轨", fontsize=10)

    # 设置坐标轴范围 - 使用线性坐标轴
    plt.ylim(0, 45)
    plt.xlim(0.48, 1.52)  # 确保足够的左右边距

    # 添加灰色斜线填充不可能区域
    # 区域 1: 质量比超过技术极限
    x_fill = np.linspace(0.48, 1.52, 100)  # 使用更宽的范围
    plt.fill_between(
        x_fill,
        achievable_ratio,
        45,
        facecolor="lightgray",
        hatch="//////",
        alpha=0.5,
        edgecolor="gray",
        label="技术上难以实现区域",
    )

    # 区域 2: 临界重力后的区域
    plt.fill_between(
        [critical_g, 1.52],
        0,
        45,
        facecolor="lightgray",
        hatch="\\\\\\\\",
        alpha=0.5,
        edgecolor="gray",
        label="物理上不可能区域",
    )

    # 添加公式说明
    g_formula = r"$r_m = e^{\frac{\Delta v}{v_e}} = e^{\frac{\sqrt{f} \cdot \sqrt{\frac{GM}{R+h}}}{v_e}}$"
    plt.text(0.52, 38, g_formula, fontsize=14, bbox=dict(facecolor="white", alpha=0.8))

    # 添加图例
    plt.legend(loc="upper right")

    return plt.gcf()


# 图表 3: 火箭质量比与速度比关系
def plot_mass_ratio_vs_velocity_ratio(delta_v):
    """绘制火箭质量比与速度比关系图"""
    plt.figure(figsize=(8, 6))

    # 生成速度比数据点
    dv_ve_ratio = np.linspace(0, 5, 1000)
    mass_ratio_simple = np.exp(dv_ve_ratio)

    # 绘制主曲线
    plt.plot(
        dv_ve_ratio,
        mass_ratio_simple,
        "b-",
        linewidth=2.5,
        label=r"$\frac{m_0}{m_f} = e^{\frac{\Delta v}{v_e}}$",
    )
    plt.grid(True, linestyle="--", alpha=0.7)
    plt.xlabel(r"$\Delta v / v_e$", fontsize=14)
    plt.ylabel(r"$m_0 / m_f$", fontsize=14)
    plt.title("火箭质量比与速度比的关系", fontsize=14)

    # 标注地球 LEO 点
    typical_ve = 3500  # m/s
    earth_dv_ve = delta_v / typical_ve
    earth_mass_ratio = np.exp(earth_dv_ve)

    plt.plot([earth_dv_ve], [earth_mass_ratio], "ro")
    plt.annotate(
        f"地球 LEO\n$\\Delta v/v_e$ ≈ {earth_dv_ve:.2f}\n$m_0/m_f$ ≈ {earth_mass_ratio:.1f}",
        xy=(earth_dv_ve, earth_mass_ratio),
        xytext=(earth_dv_ve + 0.5, earth_mass_ratio * 1.2),
        arrowprops=dict(facecolor="black", shrink=0.05, width=1.5),
        fontsize=10,
    )

    # 添加可实现质量比上限
    achievable_ratio = 20
    plt.axhline(y=achievable_ratio, color="r", linestyle="--", alpha=0.7)
    plt.text(4, achievable_ratio + 2, "可实现的典型质量比上限", fontsize=10)

    # 设置坐标轴范围
    plt.ylim(0, 100)
    plt.xlim(-0.1, 5.1)  # 确保足够的左右边距

    # 添加灰色斜线填充不可能区域，使用更宽的 x 范围
    x_fill = np.linspace(-0.1, 5.1, 100)
    plt.fill_between(
        x_fill,
        achievable_ratio,
        100,
        facecolor="lightgray",
        hatch="//////",
        alpha=0.5,
        edgecolor="gray",
        label="技术上难以实现区域",
    )

    # 添加公式
    simple_formula = r"$r_m = e^{\frac{\Delta v}{v_e}}$"
    plt.text(
        3, 30, simple_formula, fontsize=14, bbox=dict(facecolor="white", alpha=0.8)
    )

    # 添加图例
    plt.legend(loc="upper left", fontsize=12)
    plt.tight_layout()

    return plt.gcf()


# 图表 4: 火箭质量比与重力加速度关系
def plot_mass_ratio_vs_gravity(exhaust_velocity=3500):
    """绘制火箭质量比与行星重力加速度的关系"""
    plt.figure(figsize=(10, 6))

    # 定义地球标准参数
    earth_g = 9.81  # 地球标准重力加速度 m/s²
    earth_R = R  # 地球半径 m
    orbit_h = h  # 轨道高度 m

    # 生成重力加速度数据点 (0.5-1.5 倍地球重力)
    gravity_values = np.linspace(0.5 * earth_g, 1.5 * earth_g, 1000)

    # 计算每个重力加速度下的质量比
    def mass_ratio_with_gravity(gravity):
        """根据重力加速度计算质量比"""
        # 使用 g·R² 替代 GM
        delta_v = np.sqrt((gravity * earth_R**2) / (earth_R + orbit_h))
        return np.exp(delta_v / exhaust_velocity)

    mass_ratios_g = [mass_ratio_with_gravity(g) for g in gravity_values]

    # 绘制主曲线
    plt.plot(gravity_values, mass_ratios_g, "b-", linewidth=2)
    plt.grid(True, linestyle="--", alpha=0.7)
    plt.xlabel("重力加速度 $g$ (m/s²)", fontsize=12)
    plt.ylabel("质量比 $r_m = m_0/m_f$", fontsize=12)
    plt.title("火箭质量比与行星重力加速度的关系", fontsize=14)

    # 标注地球标准重力点
    earth_ratio = mass_ratio_with_gravity(earth_g)
    plt.plot([earth_g], [earth_ratio], "ro")

    earth_annotation = f"地球标准重力 ({earth_g:.2f} m/s²)\n质量比 ≈ {earth_ratio:.1f}"
    plt.annotate(
        earth_annotation,
        xy=(earth_g, earth_ratio),
        xytext=(earth_g + 0.5, earth_ratio + 2),
        arrowprops=dict(facecolor="black", shrink=0.05, width=1.5),
        fontsize=10,
    )

    # 添加可实现质量比上限线
    achievable_ratio = 20
    plt.axhline(y=achievable_ratio, color="r", linestyle="--", alpha=0.7)
    plt.text(13, achievable_ratio + 2, "可实现的典型质量比上限", fontsize=10)

    # 添加临界重力值
    critical_g = 1.21 * earth_g  # 根据上文约为 1.21 倍地球重力
    plt.axvline(x=critical_g, color="r", linestyle="-.", alpha=0.7)
    plt.text(critical_g + 0.2, 35, "重力限制点\n火箭无法入轨", fontsize=10)

    # 设置坐标轴范围 - 使用线性坐标轴
    plt.ylim(0, 45)
    plt.xlim(4.5, 15)  # 确保足够的左右边距

    # 添加灰色斜线填充不可能区域
    # 区域 1: 质量比超过技术极限
    plt.fill_between(
        [4.5, 15],
        achievable_ratio,
        45,
        facecolor="lightgray",
        hatch="//////",
        alpha=0.5,
        edgecolor="gray",
        label="技术上难以实现区域",
    )

    # 区域 2: 临界重力后的区域
    plt.fill_between(
        [critical_g, 15],
        0,
        45,
        facecolor="gray",
        hatch="\\\\\\\\\\\\",
        alpha=0.5,
        edgecolor="gray",
        label="物理上不可能区域",
    )

    # 添加公式说明
    g_formula = r"$r_m = e^{\frac{\sqrt{\frac{g \cdot R^2}{R+h}}}{v_e}}$"
    plt.text(5, 38, g_formula, fontsize=14, bbox=dict(facecolor="white", alpha=0.8))

    # 添加图例
    plt.legend(loc="upper right")

    return plt.gcf()


# 图表 5: 火箭质量比与行星半径关系
def plot_mass_ratio_vs_radius(exhaust_velocity=3500):
    """绘制火箭质量比与行星半径的关系"""
    plt.figure(figsize=(10, 6))

    # 定义地球标准参数
    earth_g = 9.81  # 地球标准重力加速度 m/s²
    earth_R = R  # 地球半径 m
    orbit_h = h  # 轨道高度 m

    # 生成行星半径数据点 (0.5-1.5 倍地球半径)
    radius_values = np.linspace(0.5 * earth_R, 1.5 * earth_R, 1000)

    # 计算每个行星半径下的质量比 (假设重力加速度保持不变)
    def mass_ratio_with_radius(radius):
        """根据行星半径计算质量比"""
        # 使用 g·R² 替代 GM，保持 g 不变
        delta_v = np.sqrt((earth_g * radius**2) / (radius + orbit_h))
        return np.exp(delta_v / exhaust_velocity)

    mass_ratios_r = [mass_ratio_with_radius(r) for r in radius_values]

    # 绘制主曲线
    plt.plot(radius_values / 1000, mass_ratios_r, "g-", linewidth=2)  # 转换为 km 显示
    plt.grid(True, linestyle="--", alpha=0.7)
    plt.xlabel("行星半径 $R$ (km)", fontsize=12)
    plt.ylabel("质量比 $r_m = m_0/m_f$", fontsize=12)
    plt.title("火箭质量比与行星半径的关系\n(假设重力加速度保持不变)", fontsize=14)

    # 标注地球标准半径点
    earth_ratio = mass_ratio_with_radius(earth_R)
    plt.plot([earth_R / 1000], [earth_ratio], "ro")

    earth_annotation = f"地球半径 ({earth_R / 1000:.0f} km)\n质量比 ≈ {earth_ratio:.1f}"
    plt.annotate(
        earth_annotation,
        xy=(earth_R / 1000, earth_ratio),
        xytext=(earth_R / 1000 + 500, earth_ratio + 2),
        arrowprops=dict(facecolor="black", shrink=0.05, width=1.5),
        fontsize=10,
    )

    # 添加可实现质量比上限线
    achievable_ratio = 20
    plt.axhline(y=achievable_ratio, color="r", linestyle="--", alpha=0.7)
    plt.text(8000, achievable_ratio + 2, "可实现的典型质量比上限", fontsize=10)

    # 设置坐标轴范围 - 使用线性坐标轴
    plt.ylim(0, 45)
    plt.xlim(3000, 10000)  # 半径范围 (km)

    # 添加灰色斜线填充不可能区域
    plt.fill_between(
        [3000, 10000],
        achievable_ratio,
        45,
        facecolor="lightgray",
        hatch="//////",
        alpha=0.5,
        edgecolor="gray",
        label="技术上难以实现区域",
    )

    # 添加公式说明
    r_formula = r"$r_m = e^{\frac{\sqrt{\frac{g \cdot R^2}{R+h}}}{v_e}}$"
    plt.text(3200, 38, r_formula, fontsize=14, bbox=dict(facecolor="white", alpha=0.8))

    # 添加物理常数信息
    constants_text = f"其中:\ng = {earth_g:.2f} m/s²\nh = {h / 1000:.0f} km (轨道高度)"
    plt.text(
        3200, 28, constants_text, fontsize=9, bbox=dict(facecolor="white", alpha=0.8)
    )

    # 添加图例
    plt.legend(loc="upper right")

    return plt.gcf()


# 图表 6: 重力系数与 delta-v/理论有效载荷关系
def plot_deltav_and_payload_vs_gravity_factor():
    """绘制重力系数与 delta-v 和理论有效载荷的关系图"""
    plt.figure(figsize=(12, 7))

    # 定义地球标准参数
    earth_g = 9.81  # 地球标准重力加速度 m/s²
    earth_R = R  # 地球半径 m
    orbit_h = h  # 轨道高度 m

    # 定义 Starship 两级火箭参数 (与 calculate_deltav.py 一致)
    m_1_dry = 275  # 一级干重，吨
    m_1_prop = 3400  # 一级推进剂，吨
    m_2_dry = 100  # 二级干重，吨
    m_2_prop = 1200  # 二级推进剂，吨
    v_e1 = 3.2  # 一级排气速度，km/s
    v_e2 = 3.7  # 二级排气速度，km/s

    # 总质量和分离质量 (不包括有效载荷)
    m_01 = m_1_dry + m_1_prop + m_2_dry + m_2_prop  # 起飞总质量，不包括有效载荷
    m_sep = m_01 - m_1_prop  # 一级分离时质量，不包括有效载荷

    # 生成重力系数数据点 (0.5-1.5 倍地球重力)
    g_factors = np.linspace(0.5, 1.5, 100)
    delta_vs = []
    payloads = []

    # 计算每个重力系数下的 delta-v 和理论有效载荷
    for f in g_factors:
        gravity = earth_g * f

        # 计算 delta-v (与 calculate_deltav.py 中的计算逻辑一致)
        # 轨道速度部分
        dv_orbit = np.sqrt((gravity * earth_R**2) / (earth_R + orbit_h))
        # 损失部分 (随重力系数线性变化)
        dv_loss = 1830 * f  # 1830m/s是地球上的典型损失
        # 总 delta-v (单位 m/s)
        delta_v = dv_orbit + dv_loss
        delta_vs.append(delta_v / 1000)  # 转换为 km/s

        # 计算理论有效载荷 (通过两级火箭方程)
        # 计算有效载荷的方程 (与 calculate_deltav.py 中的逻辑类似)
        def equation(m):
            stage1 = v_e1 * np.log((m_01 + m) / (m_sep + m))
            stage2 = v_e2 * np.log((m_sep - m_1_dry + m) / (m_2_dry + m))
            return stage1 + stage2 - delta_v / 1000  # delta_v 转换为 km/s

        # 使用二分法求解有效载荷
        m_min, m_max = -80, 1000  # 有效载荷范围
        tolerance = 0.001
        max_iterations = 100
        iteration = 0

        while m_max - m_min > tolerance and iteration < max_iterations:
            m_mid = (m_min + m_max) / 2
            try:
                f_mid = equation(m_mid)
                if abs(f_mid) < tolerance:
                    break
                if f_mid > 0:  # 有效载荷过大
                    m_min = m_mid
                else:
                    m_max = m_mid
            except (ValueError, ZeroDivisionError):
                m_max = m_mid  # 无效解，缩小上界
            iteration += 1

        payload = (m_min + m_max) / 2

        # 检查解的有效性
        if payload < -100 or payload > 1000:
            payload = np.nan  # 无效解

        payloads.append(payload)

    # 创建双 Y 轴图表
    fig, ax1 = plt.subplots(figsize=(10, 6))
    ax2 = ax1.twinx()

    # 绘制 delta-v 曲线 (左 Y 轴)
    ln1 = ax1.plot(g_factors, delta_vs, "b-", linewidth=2.5, label="Delta-v")
    ax1.set_xlabel("重力系数 f (相比地球标准重力)", fontsize=12)
    ax1.set_ylabel("Delta-v (km/s)", fontsize=12, color="b")
    ax1.tick_params(axis="y", labelcolor="b")

    # 绘制理论有效载荷曲线 (右 Y 轴)
    ln2 = ax2.plot(g_factors, payloads, "r-", linewidth=2.5, label="理论有效载荷")
    ax2.set_ylabel("理论有效载荷 (吨)", fontsize=12, color="r")
    ax2.tick_params(axis="y", labelcolor="r")

    # 设置坐标轴范围
    ax1.set_xlim(0.5, 1.5)
    ax1.set_ylim(7, 13)  # delta-v 范围适应数据
    ax2.set_ylim(-20, 800)  # 有效载荷范围适应数据

    # 标题
    plt.title("重力系数与 Delta-v/理论有效载荷的关系", fontsize=14)

    # 添加图例
    lns = ln1 + ln2
    labs = [l.get_label() for l in lns]
    ax1.legend(lns, labs, loc="upper right")

    # 添加网格线
    ax1.grid(True, linestyle="--", alpha=0.7)

    # 添加地球重力参考线
    ax1.axvline(x=1.0, color="k", linestyle="--", alpha=0.5)
    ax1.text(1.01, 7.2, "地球标准重力", fontsize=10, rotation=90)

    # 添加临界点标记
    # 找到有效载荷接近 0 的点
    critical_indexes = np.where(np.array(payloads) <= 0)[0]
    if len(critical_indexes) > 0:
        critical_index = critical_indexes[0]
        critical_factor = g_factors[critical_index]
        critical_dv = delta_vs[critical_index]

        ax1.axvline(x=critical_factor, color="r", linestyle="--", alpha=0.5)
        ax1.annotate(
            f"临界点 (f ≈ {critical_factor:.2f})",
            xy=(critical_factor, critical_dv),
            xytext=(critical_factor - 0.2, critical_dv + 0.5),
            arrowprops=dict(facecolor="black", shrink=0.05, width=1.5),
            fontsize=10,
        )

    plt.tight_layout()
    return plt.gcf()


# 保存图表
def save_figure(figure, output_dir, filename):
    """保存图表到指定位置"""
    output_path = os.path.join(output_dir, filename)
    figure.savefig(output_path, format="svg", bbox_inches="tight")
    print(f"Figure saved to {output_path}")


def main():
    """主函数"""
    # 配置环境
    setup_plot_style()
    output_dir = setup_output_dir()

    # 计算入轨所需速度增量
    delta_v = calculate_orbital_delta_v()
    print(f"Delta-v required for orbit: {delta_v / 1000:.2f} km/s")

    # 生成图表 1: 火箭质量比与排气速度关系
    fig1 = plot_mass_ratio_vs_exhaust_velocity(delta_v)
    save_figure(fig1, output_dir, "rocket_mass_ratio_vs_ve.svg")

    # 生成图表 2: 火箭质量比与重力因子关系
    fig2 = plot_mass_ratio_vs_gravity_factor(delta_v)
    save_figure(fig2, output_dir, "rocket_mass_ratio_vs_g_factor.svg")

    # 生成图表 3: 火箭质量比与速度比关系
    fig3 = plot_mass_ratio_vs_velocity_ratio(delta_v)
    save_figure(fig3, output_dir, "mass_ratio_vs_dv_ve.svg")

    # 生成新图表 4: 火箭质量比与重力加速度关系
    fig4 = plot_mass_ratio_vs_gravity()
    save_figure(fig4, output_dir, "rocket_mass_ratio_vs_gravity.svg")

    # 生成新图表 5: 火箭质量比与行星半径关系
    fig5 = plot_mass_ratio_vs_radius()
    save_figure(fig5, output_dir, "rocket_mass_ratio_vs_radius.svg")

    # 生成新图表 6: 重力系数与 delta-v/理论有效载荷关系
    fig6 = plot_deltav_and_payload_vs_gravity_factor()
    save_figure(fig6, output_dir, "deltav_and_payload_vs_gravity_factor.svg")


if __name__ == "__main__":
    main()
