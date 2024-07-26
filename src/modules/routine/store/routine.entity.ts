import { Category } from '@modules/category/store/category.entity';
import { Exercise } from '@modules/exercise/store/exercise.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import * as mongoose_fuzzy_searching from 'mongoose-fuzzy-searching';

export type RoutineDocument = HydratedDocument<Routine>;

@Schema()
export class Routine {
  @Prop()
  name: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' }] })
  exercises: Exercise[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }] })
  categories: Category[];

  @Prop()
  exercise_example: [{ url: string; name: string }];
}

export const RoutineSchema = SchemaFactory.createForClass(Routine).plugin(
  mongoose_fuzzy_searching,
  { fields: ['name'] },
);
