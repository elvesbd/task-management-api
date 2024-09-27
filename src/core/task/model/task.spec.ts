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

  describe('create', () => {
    it('should create a Task using the static create method', () => {
      const task = Task.create(props);

      expect(task.id).toBeDefined();
      expect(task.title).toBe(props.title);
      expect(task.deadline).toEqual(props.deadline);
      expect(task.tenantId).toBe(props.tenantId);
      expect(task.status).toBe(TaskStatus.PENDING);
      expect(task.description).toBe(props.description);
    });
  });

  describe('update', () => {
    it('should update task title on success', () => {
      const task = new Task(taskMock);
      const updateProps = TaskDataBuilder.aTask()
        .withTitle('New Task Title')
        .build();

      task.update(updateProps);

      expect(task.id).toBe(taskMock.id);
      expect(task.title).toBe(updateProps.title);
    });

    it('should update task deadline on success', () => {
      const task = new Task(taskMock);
      const updateProps = TaskDataBuilder.aTask()
        .withDeadline(new Date(2024, 12, 31))
        .build();

      task.update(updateProps);

      expect(task.id).toBe(taskMock.id);
      expect(task.deadline).toEqual(updateProps.deadline);
    });

    it('should update task description on success', () => {
      const task = new Task(taskMock);
      const updateProps = TaskDataBuilder.aTask()
        .withDescription('New Task Description')
        .build();

      task.update(updateProps);

      expect(task.id).toBe(taskMock.id);
      expect(task.description).toBe(updateProps.description);
    });

    it('should update task title, deadline, tenantId, and description on success', () => {
      const task = new Task(taskMock);
      const updateProps = TaskDataBuilder.aTask()
        .withTitle('New Task Title')
        .withDeadline(new Date(2024, 12, 31))
        .withTenantId('newTenantId')
        .withDescription('New Task Description')
        .build();

      task.update(updateProps);

      expect(task.id).toBe(taskMock.id);
      expect(task.title).toBe(updateProps.title);
      expect(task.deadline).toEqual(updateProps.deadline);
      expect(task.tenantId).toBe(updateProps.tenantId);
      expect(task.description).toBe(updateProps.description);
    });
  });

  describe('assignStatus', () => {
    it('should assign a new status to the task on success', () => {
      const task = new Task(taskMock);
      const newStatus = TaskStatus.COMPLETED;

      task.assignStatus(newStatus);

      expect(task.status).toBe(newStatus);
    });
  });
});
