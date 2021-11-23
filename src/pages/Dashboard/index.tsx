import { useEffect, useState } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

interface IFood {
  id: number;
  image: string;
  name: string;
  description: string;
  price: number;
  available: boolean;
}

const Dashboard: React.FC = (props) => {
  const [foods, setFoods] = useState<IFood[]>([]);
  const [editingFood, setEditingFood] = useState<IFood>({} as IFood);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const { data } = await api.get('/foods');
      setFoods(data);
    })();
  }, []);

  async function handleAddFood(food: IFood) {
    try {
      const { data } = await api.post('/foods', {
        ...food,
        available: true,
      });
      setFoods([...foods, data]);
    } catch (error) {
      console.log(error);
    }
  }
  async function handleUpdateFood(food: IFood) {
    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map(food =>
        food.id !== foodUpdated.data.id ? food : foodUpdated.data,
      );
      setFoods(foodsUpdated);
    } catch (error) {
      console.log(error);
    }
  }
  async function handleDeleteFood(id: number) {
    try {
      await api.delete(`/foods/${id}`);

      const foodsFiltered = foods.filter(food => food.id !== id);
      setFoods(foodsFiltered);
    } catch (error) {
      console.log(error);
    }
  }

  function toggleModal() {
    setModalOpen(!modalOpen);
  }
  function toggleEditModal() {
    setEditModalOpen(!editModalOpen);
  }
  function handleEditFood(food: IFood) {
    setEditingFood(food);
    setEditModalOpen(true); 
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
};

export default Dashboard;
