import { PlaneVector } from '@/ts/geometry.ts'

/**
 * Calculate the rotation angle.
 * @param origin_size - The size of the origin element.
 * @param target_size - The size of the target element.
 * @param cur_direction - The current direction of the origin element.
 * @returns The rotation angle in degrees.
 */
function calcRotationAngle(
    origin_pos: PlaneVector,
    target_pos: PlaneVector,
    origin_size: PlaneVector,
    target_size: PlaneVector,
    cur_direction: PlaneVector,
): number {
    const target_direction: PlaneVector = new PlaneVector(
        target_pos.x - origin_pos.x + target_size.x / 2 - origin_size.x / 2,
        target_pos.y - origin_pos.y + target_size.y / 2 - origin_size.y / 2
    )
    // cos(theta) = (A * B) / (||A|| * ||B||), where theta is the arc angle between vector A and B.
    let angle: number = Math.acos(cur_direction.dot(target_direction) / (cur_direction.getNorm() * target_direction.getNorm())) * 180 / Math.PI

    if (target_direction.x - cur_direction.x > 0) {
        angle *= -1
    }

    return angle
}

/**
 * Calculate the number of hex tiles by the given size of the board.
 * @param size - The number of hex tiles on a radius of the board.
 */
function calcHexNum(size: number): number {
    if (size < 1) { return 0 }
    if (size === 1) { return 1 }
    if (size === 2) { return 7 }

    return 1 + Math.round((6 + (size - 1) * 6) * (size - 1) / 2)
}

export { calcHexNum, calcRotationAngle }
