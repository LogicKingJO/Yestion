package com.yestion.service;

import com.yestion.dto.TodoDto;
import com.yestion.entity.Category;
import com.yestion.entity.Todo;
import com.yestion.entity.User;
import com.yestion.repository.CategoryRepository;
import com.yestion.repository.TodoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TodoService {

    private final TodoRepository todoRepository;
    private final CategoryRepository categoryRepository;

    // 할 일 목록 조회 (날짜 필터 선택)
    public List<TodoDto.Response> getTodos(User user, String date) {
        List<Todo> todos = (date != null)
                ? todoRepository.findByUserIdAndDate(user.getId(), date)
                : todoRepository.findByUserId(user.getId());

        return todos.stream()
                .map(TodoDto.Response::new)
                .collect(Collectors.toList());
    }

    // 할 일 생성
    public TodoDto.Response createTodo(User user, TodoDto.CreateRequest request) {
        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId()).orElse(null);
        }

        Todo todo = Todo.builder()
                .user(user)
                .category(category)
                .title(request.getTitle())
                .memo(request.getMemo())
                .dueDate(request.getDueDate())
                .date(request.getDate())
                .done(false)
                .build();

        return new TodoDto.Response(todoRepository.save(todo));
    }

    // 할 일 수정 (부분 수정)
    @Transactional
    public TodoDto.Response updateTodo(Long todoId, TodoDto.UpdateRequest request) {
        Todo todo = todoRepository.findById(todoId)
                .orElseThrow(() -> new IllegalArgumentException("할 일을 찾을 수 없습니다."));

        if (request.getTitle()    != null) todo.setTitle(request.getTitle());
        if (request.getMemo()     != null) todo.setMemo(request.getMemo());
        if (request.getDueDate()  != null) todo.setDueDate(request.getDueDate());
        if (request.getDate()     != null) todo.setDate(request.getDate());
        if (request.getDone()     != null) todo.setDone(request.getDone());
        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId()).orElse(null);
            todo.setCategory(category);
        }

        return new TodoDto.Response(todo);
    }

    // 할 일 삭제
    public void deleteTodo(Long todoId) {
        Todo todo = todoRepository.findById(todoId)
                .orElseThrow(() -> new IllegalArgumentException("할 일을 찾을 수 없습니다."));
        todoRepository.delete(todo);
    }
}
