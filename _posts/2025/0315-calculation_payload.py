#!/usr/bin/env python3
"""
计算不同重力加速度系数下的 delta-v 值
"""

import math

import numpy as np

# 定义地球参数
G = 6.6743e-11  # 万有引力常数，m^3/(kg*s^2)
M = 5.9722e24  # 地球质量，kg
R = 6371e3  # 地球半径，m
h = 400e3  # 轨道高度，m (400 km)
g_earth = 9.81  # 地球标准重力加速度，m/s²

# 定义化学火箭参数
v_e = 3500  # 排气速度，m/s (典型值)
max_mass_ratio = 20  # 最大可行质量比

# 定义 Starship 两级火箭参数 (来自 markdown 文件)
m_1_dry = 275  # 一级干重，吨
m_1_prop = 3400  # 一级推进剂，吨
m_2_dry = 100  # 二级干重，吨
m_2_prop = 1200  # 二级推进剂，吨
v_e1 = 3.2  # 一级排气速度，km/s
v_e2 = 3.7  # 二级排气速度，km/s

# 总质量和分离质量 (不包括有效载荷)
m_01 = m_1_dry + m_1_prop + m_2_dry + m_2_prop  # 起飞总质量，不包括有效载荷
m_sep = m_01 - m_1_prop  # 一级分离时质量，不包括有效载荷


# 计算 delta-v 的函数 (使用 g·R²替代 GM)
def calculate_delta_v(gravity):
    """计算给定重力加速度下的 delta-v"""
    # 轨道速度部分
    dv_orbit = np.sqrt((gravity * R**2) / (R + h))

    # 损失部分 (大气阻力和重力损失)，随重力加速度比例变化
    # 地球上约为 1.77 km/s = 1770 m/s
    # 再加上一些其他损失，比如纬度，大概取 0.06 km/s
    # dv_loss 取 1.83 km/s = 1830 m/s
    f = gravity / g_earth  # 计算重力系数
    dv_loss = 1830 * f  # 损失随重力系数线性变化

    # 总 delta-v
    return dv_orbit + dv_loss


def calculate_payload(target_value):
    """计算给定目标 delta-v 值对应的有效载荷

    使用 Starship 两级火箭参数计算有效载荷，基于 markdown 文件中的公式：
    ∆v_LEO = 3.2 ln((4975 + m_payload)/(1575 + m_payload)) + 3.7 ln((1575 - 275 + m_payload)/(100 + m_payload)) km/s

    Args:
        target_value: 目标 delta-v (km/s)

    Returns:
        包含计算结果和验证信息的字典
    """

    # 定义方程函数 - 两级火箭方程
    def equation(m):
        if (4975 + m) <= 0 or (1575 + m) <= 0 or (1300 + m) <= 0 or (100 + m) <= 0:
            return float("inf")

        try:
            stage1 = v_e1 * math.log((m_01 + m) / (m_sep + m))
            stage2 = v_e2 * math.log((m_sep - m_1_dry + m) / (m_2_dry + m))
            return stage1 + stage2 - target_value
        except ValueError:
            return float("inf")

    # 方程的导数函数
    def derivative_equation(m):
        if (
            (m_01 + m) <= 0
            or (m_sep + m) <= 0
            or (m_sep - m_1_dry + m) <= 0
            or (m_2_dry + m) <= 0
        ):
            return float("inf")

        try:
            stage1_derivative = v_e1 * (m_sep - m_01) / ((m_01 + m) * (m_sep + m))
            stage2_derivative = (
                v_e2
                * (m_2_dry - m_sep + m_1_dry)
                / ((m_sep - m_1_dry + m) * (m_2_dry + m))
            )
            return stage1_derivative + stage2_derivative
        except (ValueError, ZeroDivisionError):
            return float("inf")

    # 二分查找法
    def binary_search(f, min_val, max_val, tolerance=1e-6, max_iterations=1000):
        a = min_val
        b = max_val
        iteration = 0

        while (b - a) > tolerance and iteration < max_iterations:
            mid = (a + b) / 2
            f_mid = f(mid)

            if abs(f_mid) < tolerance:
                return mid

            if f_mid == float("inf"):
                a = mid
            elif f(a) * f_mid < 0:
                b = mid
            else:
                a = mid

            iteration += 1

        return (a + b) / 2

    # 牛顿 - 拉夫森法
    def newton_raphson(f, f_prime, initial_guess, tolerance=1e-6, max_iterations=100):
        x = initial_guess
        iteration = 0

        while iteration < max_iterations:
            try:
                fx = f(x)

                if fx == float("inf"):
                    x = max(x + 100, 0)
                    continue

                if abs(fx) < tolerance:
                    return x

                f_prime_x = f_prime(x)

                if f_prime_x == float("inf") or abs(f_prime_x) < 1e-10:
                    x += tolerance * 10
                    continue

                x_new = x - fx / f_prime_x

                if abs(x_new - x) < tolerance:
                    return x_new

                x = x_new

            except (ValueError, ZeroDivisionError):
                x = max(x + 100, 0)

            iteration += 1

        return x

    try:
        # 使用二分查找求解
        result1 = binary_search(equation, -50, 1000)

        # 检查结果是否有效
        if math.isnan(result1) or result1 < -100:
            return {
                "binary_search_result": 0,
                "newton_raphson_result": 0,
                "verification": {
                    "binary_search": float("inf"),
                    "newton_raphson": float("inf"),
                },
                "error": "无法找到有效解",
            }

        # 使用牛顿 - 拉夫森法验证
        result2 = newton_raphson(equation, derivative_equation, max(result1, 0))

        # 返回结果和验证信息
        return {
            "binary_search_result": round(result1, 2),
            "newton_raphson_result": round(result2, 2),
            "verification": {
                "binary_search": round(equation(result1), 10),
                "newton_raphson": round(equation(result2), 10),
            },
        }
    except Exception as e:
        # 捕获任何其他错误
        return {
            "binary_search_result": 0,
            "newton_raphson_result": 0,
            "verification": {
                "binary_search": float("inf"),
                "newton_raphson": float("inf"),
            },
            "error": str(e),
        }


def verify_solution(m, target_value):
    """验证解的正确性"""
    try:
        # 使用两级火箭方程验证
        stage1 = v_e1 * math.log((m_01 + m) / (m_sep + m))
        stage2 = v_e2 * math.log((m_sep - m_1_dry + m) / (m_2_dry + m))
        calculated_value = stage1 + stage2

        print(f"验证：{stage1:.6f} + {stage2:.6f} = {calculated_value:.6f}")
        print(f"差异：{abs(calculated_value - target_value):.10f}")

        return calculated_value
    except (ValueError, ZeroDivisionError):
        print("验证失败：计算过程中出现数学错误")
        return float("inf")


# 计算基于火箭方程的最大 delta-v
max_possible_dv = v_e * np.log(max_mass_ratio)

# 计算不同重力系数下的 delta-v
gravity_factors = [0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4, 1.5]
results = []

print(
    f"最大可能的 delta-v(基于 v_e={v_e}m/s, 质量比={max_mass_ratio}): {max_possible_dv:.0f} m/s = {max_possible_dv / 1000:.2f} km/s\n"
)
print("| 重力系数 f | 重力加速度 (m/s²) | delta-v (km/s) | 理论有效载荷 (吨) |")
print("|:----------:|------------------:|---------------:|-------------:|")

for f in gravity_factors:
    gravity = g_earth * f
    dv = calculate_delta_v(gravity)
    percent_of_max = (dv / max_possible_dv) * 100
    mr = np.exp(dv / v_e)  # 仍计算质量比但不显示

    # 使用 delta-v 值计算有效载荷
    try:
        payload_result = calculate_payload(dv / 1000)  # 转换为 km/s 作为目标值
        if "error" in payload_result:
            payload = "N/A"
        else:
            payload = payload_result["binary_search_result"]
    except Exception:
        payload = "N/A"

    if isinstance(payload, str):
        print(
            f"| {f:.2f}       | {gravity:.2f}             | {dv / 1000:.2f}          | {payload}        |"
        )
    else:
        print(
            f"| {f:.2f}       | {gravity:.2f}             | {dv / 1000:.2f}          | {payload:.2f}        |"
        )

    results.append(
        {
            "factor": f,
            "gravity": gravity,
            "delta_v": dv,
            "mass_ratio": mr,
            "payload": payload,
        }
    )

# 直接计算临界重力系数
# 现在我们需要解决更复杂的方程：
# max_possible_dv = sqrt((g_earth * f * R^2)/(R+h)) + 1770 * f
# 这不容易直接解析求解，我们使用数值方法


def critical_equation(f):
    """计算 f 值对应的 delta-v 与 max_possible_dv 的差值"""
    gravity = g_earth * f
    dv = calculate_delta_v(gravity)
    return dv - max_possible_dv


# 使用二分法求解
f_min, f_max = 0.5, 3.0
tolerance = 0.0001
max_iterations = 100
iteration = 0

while f_max - f_min > tolerance and iteration < max_iterations:
    f_mid = (f_min + f_max) / 2
    if critical_equation(f_mid) * critical_equation(f_min) < 0:
        f_max = f_mid
    else:
        f_min = f_mid
    iteration += 1

critical_factor = (f_min + f_max) / 2
critical_gravity = critical_factor * g_earth
critical_dv = calculate_delta_v(critical_gravity)

try:
    critical_payload_result = calculate_payload(critical_dv / 1000)
    if "error" in critical_payload_result:
        critical_payload = "N/A"
    else:
        critical_payload = critical_payload_result["binary_search_result"]
except Exception:
    critical_payload = "N/A"

print(f"\n数值计算的临界重力系数：{critical_factor:.4f}")
print(f"临界重力加速度：{critical_gravity:.2f} m/s²")
print(f"这是地球重力加速度的 {critical_factor:.2f} 倍")
if isinstance(critical_payload, str):
    print(f"临界条件下的有效载荷：{critical_payload}")
else:
    print(f"临界条件下的有效载荷：{critical_payload:.2f} 吨")
print(
    f"当重力加速度超过 {critical_gravity:.2f} m/s² 时，以当前化学火箭技术 (v_e={v_e}m/s, 最大质量比={max_mass_ratio}) 将无法入轨。"
)

# 分析重力系数为 1.2 时的情况
f_special = 1.2
g_special = g_earth * f_special
dv_special = calculate_delta_v(g_special)

try:
    special_payload_result = calculate_payload(dv_special / 1000)
    if "error" in special_payload_result:
        special_payload = "N/A"
    else:
        special_payload = special_payload_result["binary_search_result"]
except Exception:
    special_payload = "N/A"

# 验证一些关键情况下的有效载荷计算
print("\n\n--------------------------------------------------")
print("验证部分关键情况下的有效载荷计算：")

key_cases = [
    {"desc": "地球标准重力 (f=1.0)", "dv": calculate_delta_v(g_earth)},
    {"desc": "临界重力系数", "dv": critical_dv},
    {"desc": "f=1.2 情况", "dv": dv_special},
]

for case in key_cases:
    try:
        payload_result = calculate_payload(case["dv"] / 1000)
        if "error" in payload_result:
            payload = "N/A"
        else:
            payload = payload_result["binary_search_result"]

        print(f"\n{case['desc']}:")
        print(f"delta-v = {case['dv']:.0f} m/s = {case['dv'] / 1000:.2f} km/s")

        if isinstance(payload, str):
            print(f"计算的有效载荷 = {payload}")
        else:
            print(f"计算的有效载荷 = {payload:.2f} 吨")

            # 验证计算结果
            verify_solution(payload, case["dv"] / 1000)
    except Exception as e:
        print(f"\n{case['desc']}:")
        print(f"delta-v = {case['dv']:.0f} m/s = {case['dv'] / 1000:.2f} km/s")
        print(f"计算有效载荷失败：{str(e)}")
