import { Task } from '@core/task/model';
import { TaskStatus } from '@core/task/enum';
import { TaskDataBuilder } from '@test/__mocks__/data-builder/task';

describe('Task Model', () => {
  const props = TaskDataBuilder.aTask().build();
  const taskMock = TaskDataBuilder.aTask().withId().build();

  describe('constructor', () => {
    it('should create a new Task on success', () => {
      const task = new Task(taskMock);

      expect(task.id).toBe(taskMock.id);
      expect(task.title).toBe(taskMock.title);
      expect(task.deadline).toEqual(taskMock.deadline);
      expect(task.tenantId).toBe(taskMock.tenantId);
      expect(task.status).toBe(taskMock.status);
      expect(task.description).toBe(taskMock.description);
    });
  });
});
