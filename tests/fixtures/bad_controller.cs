// TEST FIXTURE: bad_controller.cs
// ไฟล์นี้มี violations จงใจสำหรับ test ssd-backend-review และ ssd-backend-refactor
// Expected violations: 7 รายการ

using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using MyProject.Data;
using MyProject.DTOs;
using MyProject.Services;

namespace MyProject.Controllers
{
    // VIOLATION 1: ไม่มี [Authorize]
    [ApiController]
    [Route("api/OrderHeader")]  // VIOLATION 2: route ไม่ใช่ kebab-case
    public class OrderController : ControllerBase
    {
        // VIOLATION 3: private field ไม่มี _ prefix
        private readonly IOrderService orderService;
        private readonly AppDbContext dbContext;
        private readonly IMapper mapper;

        public OrderController(
            IOrderService orderService,
            AppDbContext dbContext,
            IMapper mapper)
        {
            this.orderService = orderService;
            this.dbContext = dbContext;
            this.mapper = mapper;
        }

        // VIOLATION 4: ไม่มี XML comment
        // VIOLATION 5: [HttpGet] ไม่มี Name attribute
        [HttpGet]
        public async Task<IActionResult> GetOrders()
        {
            var orders = await dbContext.Orders.ToListAsync();  // VIOLATION: router เรียก ORM โดยตรง
            var result = mapper.Map<List<OrderDto>>(orders);    // VIOLATION 6: Map() หลัง ToList()
            return Ok(result);  // VIOLATION 7: ไม่ใช้ ResponseResult
        }

        // VIOLATION 4: ไม่มี XML comment
        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderDto dto)
        {
            var order = await orderService.CreateAsync(dto);
            return Ok(order);  // VIOLATION 7: ไม่ใช้ ResponseResult
        }

        // VIOLATION: ใช้ DELETE แทน POST + action path
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            await orderService.DeleteAsync(id);
            return NoContent();
        }
    }
}
