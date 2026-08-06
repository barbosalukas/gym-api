import dayjs from "dayjs";
import { CheckIn } from "../../generated/prisma/client";
import { CheckInUncheckedCreateInput } from "../../generated/prisma/models/CheckIn";
import { prisma } from "../../lib/prisma";
import { CheckInsRepository } from "../check-ins-repository";

export class PrismaCheckInsRepository implements CheckInsRepository {
  async create(data: CheckInUncheckedCreateInput) {
    const checkIn = await prisma.checkIn.create({
      data,
    });

    return checkIn;
  }

  async findById(id: string) {
    const checkIn = await prisma.checkIn.findUnique({
      where: {
        id,
      },
    });

    return checkIn;
  }

  async findManyByUserId(userId: string, page: number) {
    const checkIn = await prisma.checkIn.findMany({
      where: {
        user_id: userId,
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return checkIn;
  }

  async countByUserId(userId: string) {
    const count = await prisma.checkIn.count({
      where: {
        user_id: userId,
      },
    });

    return count;
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const starOfTheDate = dayjs(date).startOf("date");
    const endOfTheDate = dayjs(date).endOf("date");

    const checkIns = await prisma.checkIn.findFirst({
      where: {
        user_id: userId,
        created_at: {
          gte: starOfTheDate.toDate(),
          lte: endOfTheDate.toDate(),
        },
      },
    });

    return checkIns;
  }

  async save(data: CheckIn) {
    const checkIn = await prisma.checkIn.update({
      where: { id: data.id },
      data,
    });

    return checkIn;
  }
}
